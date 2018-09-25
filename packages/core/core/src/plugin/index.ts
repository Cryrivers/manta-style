import { Annotation } from '../utils/annotation';
import { generateErrorMessage, ErrorCode } from '../utils/errorMessage';
import { Type, Endpoint, MantaStyleContext } from '..';

const PLUGIN_PREFIX = ['@manta-style/', 'manta-style-'];

export const PLUGIN_REGEX = new RegExp(
  PLUGIN_PREFIX.map((prefix) => `(^${prefix}(mock|builder|server)-)`).join('|'),
);

const MOCK_PLUGIN_REGEX = new RegExp(
  PLUGIN_PREFIX.map((prefix) => `(^${prefix}mock-)`).join('|'),
);

const BUILDER_PLUGIN_REGEX = new RegExp(
  PLUGIN_PREFIX.map((prefix) => `(^${prefix}builder-)`).join('|'),
);

const SERVER_PLUGIN_REGEX = new RegExp(
  PLUGIN_PREFIX.map((prefix) => `(^${prefix}server-)`).join('|'),
);

export type CompiledTypes = {
  [key: string]: Type | undefined;
};

export interface ServerPlugin {
  name: string;
  generateEndpoints(
    compiled: CompiledTypes,
    options: { proxyUrl?: string },
  ): Endpoint[];
}

type MockResult<T> = T | null | Promise<T | null>;
type MockPrimitiveResult<T extends SupportedMockType> = T extends 'StringType'
  ? string
  : T extends 'NumberType' ? number : T extends 'BooleanType' ? boolean : any;
type MockFunction<T extends SupportedMockType> = (
  annotations: Annotation[],
  context: MantaStyleContext,
) => MockResult<MockPrimitiveResult<T>>;

type SupportedMockType = 'StringType' | 'NumberType' | 'BooleanType';

type MockCallback<T extends SupportedMockType> = (
  mockFunction: MockFunction<T>,
) => MockResult<MockPrimitiveResult<T>>;

export interface MockPlugin {
  name: string;
  mock: { [key in SupportedMockType]?: MockFunction<key> };
}
export interface BuilderPlugin {
  name: string;
  supportedExtensions: string[];
  buildConfigFile(
    configFilePath: string,
    destDir: string,
    verbose?: boolean,
    importHelpers?: boolean,
  ): Promise<string>;
  buildConfigSource(sourceCode: string): Promise<string>;
}

export type Plugin = MockPlugin | BuilderPlugin | ServerPlugin;

type PluginEntry<T extends Plugin = Plugin> = {
  name: string;
  module: T;
};

export class PluginSystem {
  static default() {
    return new PluginSystem([]);
  }
  private mockPlugins: {
    [key in SupportedMockType]?: Array<{
      name: string;
      mock: Required<MockPlugin['mock']>[key];
    }>
  } = {};
  private builderPlugins: {
    [key: string]: BuilderPlugin | undefined;
  } = {};
  private serverPlugin!: PluginEntry<ServerPlugin>;
  public getMockPluginCount() {
    return Object.keys(this.mockPlugins).length;
  }
  public getBuilderPluginCount() {
    return Object.keys(this.builderPlugins).length;
  }
  constructor(plugins: PluginEntry[]) {
    for (const plugin of plugins) {
      if (isMockPlugin(plugin)) {
        const { name, mock } = plugin.module;
        const types = Object.keys(mock) as SupportedMockType[];
        for (const type of types) {
          const mockFunction = mock[type];
          if (mockFunction) {
            // @ts-ignore
            (this.mockPlugins[type] = this.mockPlugins[type] || []).push({
              name,
              mock: mockFunction,
            });
          }
        }
      } else if (isBuilderPlugin(plugin)) {
        const { module } = plugin;
        const { supportedExtensions } = module;
        for (const extension of supportedExtensions) {
          const currentHandler = this.builderPlugins[extension];
          if (!currentHandler) {
            this.builderPlugins[extension] = module;
          } else {
            throw new Error(
              `Builder Plugin Error, both "${plugin.name}" and "${
                currentHandler.name
              }" handle file type "${extension}"`,
            );
          }
        }
      } else if (isServerPlugin(plugin)) {
        this.serverPlugin = plugin;
      }
    }
  }
  public async getMockValueFromPlugin<T extends SupportedMockType>(
    type: T,
    callback: MockCallback<T>,
  ) {
    const plugins = this.mockPlugins[type];
    if (plugins) {
      // @ts-ignore
      for (const plugin of plugins) {
        try {
          const value = await callback(plugin.mock);
          if (value !== null) {
            return value;
          }
        } catch (e) {
          console.error(`@manta-style Error from plugin: ${plugin.name}`);
          console.error(e);
        }
      }
    }
    return null;
  }
  public async buildConfigFile(
    configFilePath: string,
    destDir: string,
    verbose?: boolean,
    importHelpers?: boolean,
  ): Promise<string> {
    const extension = extractNormalizedExtension(configFilePath);
    const handler = this.builderPlugins[extension];
    if (handler) {
      return handler.buildConfigFile(
        configFilePath,
        destDir,
        verbose,
        importHelpers,
      );
    } else {
      throw new Error(
        generateErrorMessage(ErrorCode.UNSUPPORTED_EXTENSION, extension),
      );
    }
  }
  public async buildConfigSource(
    sourceCode: string,
    extension: string,
  ): Promise<string> {
    const handler = this.builderPlugins[extension];
    if (handler) {
      return handler.buildConfigSource(sourceCode);
    } else {
      throw new Error(
        generateErrorMessage(ErrorCode.UNSUPPORTED_EXTENSION, extension),
      );
    }
  }
  public getServer(): ServerPlugin {
    return this.serverPlugin.module;
  }
}

function extractNormalizedExtension(filePath: string) {
  const result = filePath.match(/(?:\.([^.]+))?$/);
  if (result) {
    return result[1];
  } else {
    return '';
  }
}

function isMockPlugin(plugin: PluginEntry): plugin is PluginEntry<MockPlugin> {
  return MOCK_PLUGIN_REGEX.test(plugin.name);
}

function isBuilderPlugin(
  plugin: PluginEntry,
): plugin is PluginEntry<BuilderPlugin> {
  return BUILDER_PLUGIN_REGEX.test(plugin.name);
}

function isServerPlugin(
  plugin: PluginEntry,
): plugin is PluginEntry<ServerPlugin> {
  return SERVER_PLUGIN_REGEX.test(plugin.name);
}
