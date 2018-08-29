export type Plugin = { name: string; mock: Function };

const PLUGIN_PREFIX = ['@manta-style/plugin', 'manta-style-plugin'];
export const PLUGIN_REGEX = new RegExp(
  PLUGIN_PREFIX.map((prefix) => `(^${prefix})`).join('|'),
);
const MOCK_PLUGIN_REGEX = new RegExp(
  PLUGIN_PREFIX.map((prefix) => `(^${prefix}-mock-)`).join('|'),
);

type Plugins = {
  [name: string]: Array<Plugin>;
};

class PluginSystem {
  static default() {
    return new PluginSystem([]);
  }

  mockPlugin: Plugins;
  constructor(plugins: { name: string; module: any }[]) {
    this.mockPlugin = {};
    for (const plugin of plugins) {
      if (plugin.name.match(MOCK_PLUGIN_REGEX)) {
        const { name, mock } = plugin.module;
        for (const mockType in mock) {
          (this.mockPlugin[mockType] = this.mockPlugin[mockType] || []).push({
            name,
            mock: mock[mockType],
          });
        }
      }
    }
  }

  public async getMockValueFromPlugin(type: string, callback: Function) {
    const plugins = this.mockPlugin[type];
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

export default PluginSystem;
