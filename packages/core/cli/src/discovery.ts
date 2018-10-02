import * as readPkgUp from 'read-pkg-up';
import * as resolveFrom from 'resolve-from';
import { PLUGIN_REGEX } from '@manta-style/core';

const DEFAULT_PLUGINS = [
  '@manta-style/server-restful',
  '@manta-style/mock-example',
  '@manta-style/mock-range',
];

export async function findPlugins() {
  const file = process.cwd();
  const { pkg } = await readPkgUp({ cwd: file, normalize: true });
  const plugins = [
    ...filterDependency(pkg.dependencies),
    ...filterDependency(pkg.devDependencies),
  ];
  return [...defaultPlugins(DEFAULT_PLUGINS), ...customPlugins(plugins, file)];
}

function defaultPlugins(packageNames: string[]) {
  return packageNames.map((name) => ({
    name,
    module: defaultInterops(require(name)),
  }));
}

function customPlugins(packageNames: string[], resolvePath: string) {
  return packageNames.map((plugin) => {
    return {
      name: plugin,
      module: defaultInterops(require(resolveFrom(resolvePath, plugin))),
    };
  });
}

function filterDependency(dep: { [name: string]: string } | undefined) {
  if (dep) {
    return Object.keys(dep).filter(
      (name) => PLUGIN_REGEX.test(name) && !DEFAULT_PLUGINS.includes(name),
    );
  }
  return [];
}

function defaultInterops(pkg: any) {
  return pkg.default !== undefined ? pkg.default : pkg;
}
