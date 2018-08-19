import findPlugins from "./discovery";

class PluginSystem {
  static async discover(filePath: string) {
    return new PluginSystem(await findPlugins(filePath));
  }

  mockPlugin: string[];
  constructor(plugins: {name: string, module: string}[]) {
    this.mockPlugin = [];
    for (const plugin of plugins) {
      if (plugin.name.match(/@manta-style\/plugin-mock-/)) {
        this.mockPlugin.push(plugin);
      }
    }
  }
}
