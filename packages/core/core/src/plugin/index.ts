import { Annotation } from '../utils/annotation';

const PLUGIN_PREFIX = ['@manta-style/plugin', 'manta-style-plugin'];

export const PLUGIN_REGEX = new RegExp(
  PLUGIN_PREFIX.map((prefix) => `(^${prefix})`).join('|'),
);

const MOCK_PLUGIN_REGEX = new RegExp(
  PLUGIN_PREFIX.map((prefix) => `(^${prefix}-mock-)`).join('|'),
);

const BUILDER_PLUGIN_REGEX = new RegExp(
  PLUGIN_PREFIX.map((prefix) => `(^${prefix}-builder-)`).join('|'),
);

type AnyObject = { [key: string]: any };
type MockResult<T> = T | null | Promise<T | null>;

export interface MockPlugin {
  name: string;
  mock: {
    StringType?: (annotations: Annotation[]) => MockResult<string>;
    NumberType?: (annotations: Annotation[]) => MockResult<number>;
    BooleanType?: (annotations: Annotation[]) => MockResult<boolean>;
    TypeLiteral?: (annotations: Annotation[]) => MockResult<AnyObject>;
  };
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

export type Plugin = MockPlugin | BuilderPlugin;

type PluginEntry<T extends Plugin = Plugin> = {
  name: string;
  module: T;
};
type SupportedMockType = keyof MockPlugin['mock'];
type SupportedMockFunction = Required<MockPlugin['mock']>[SupportedMockType];

export class PluginSystem {
  static default() {
    return new PluginSystem([]);
  }
  private mockPlugins: {
    [key: string]:
      | Array<{ name: string; mock: SupportedMockFunction }>
      | undefined;
  } = {};
  private builderPlugins: {
    [key: string]: BuilderPlugin | undefined;
  } = {};
  constructor(plugins: PluginEntry[]) {
    for (const plugin of plugins) {
      if (isMockPlugin(plugin)) {
        const { name, mock } = plugin.module;
        const types = Object.keys(mock) as SupportedMockType[];
        for (const type of types) {
          const mockFunction = mock[type];
          if (mockFunction) {
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
      }
    }
  }
  public async getMockValueFromPlugin(
    type: SupportedMockType,
    callback: Function,
  ) {
    const plugins = this.mockPlugins[type];
    if (plugins) {
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
        `Extension "${extension}" is not handled by any builder plugins.`,
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
        `Extension "${extension}" is not handled by any builder plugins.`,
      );
    }
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
