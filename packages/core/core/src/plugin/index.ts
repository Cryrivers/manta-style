import { Annotation } from '../utils/annotation';

const PLUGIN_PREFIX = ['@manta-style/plugin', 'manta-style-plugin'];

export const PLUGIN_REGEX = new RegExp(
  PLUGIN_PREFIX.map((prefix) => `(^${prefix})`).join('|'),
);

const MOCK_PLUGIN_REGEX = new RegExp(
  PLUGIN_PREFIX.map((prefix) => `(^${prefix}-mock-)`).join('|'),
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
  build(configFilePath: string): Promise<string[]>;
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
}

function isMockPlugin(plugin: PluginEntry): plugin is PluginEntry<MockPlugin> {
  return MOCK_PLUGIN_REGEX.test(plugin.name);
}
