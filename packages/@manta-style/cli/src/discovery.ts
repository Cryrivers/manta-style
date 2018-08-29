import * as readPkgUp from 'read-pkg-up';
import * as resolveFrom from 'resolve-from';
import { PluginSystem, PLUGIN_REGEX } from '@manta-style/core';

export default class PluginDiscovery {
  static async findPlugins(file: string) {
    const { pkg } = await readPkgUp({ cwd: file, normalize: true });
    const plugins = [
      ...filterDependency(pkg.dependencies),
      ...filterDependency(pkg.devDependencies),
    ];

    return new PluginSystem(
      plugins.map((plugin) => {
        return {
          name: plugin,
          module: defaultInterops(require(resolveFrom(file, plugin))),
        };
      }),
    );
  }
}

function filterDependency(dep: { [name: string]: string } | undefined) {
  if (dep) {
    return Object.keys(dep).filter((name) => PLUGIN_REGEX.test(name));
  }
  return [];
}

function defaultInterops(pkg: any) {
  return pkg.default !== undefined ? pkg.default : pkg;
}
