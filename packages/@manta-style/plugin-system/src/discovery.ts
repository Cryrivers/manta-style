import * as readPkgUp from 'read-pkg-up';
import * as resolveFrom from 'resolve-from';

const PLUGIN_REGEX = /(^@manta-style\/plugin)|(^manta-style-plugin)/;

export default async function findPlugins(file: string) {
  const { pkg } = await readPkgUp({ cwd: file, normalize: true });
  const plugins = [
    ...filterDependency(pkg.dependencies),
    ...filterDependency(pkg.devDependencies),
  ];
  return plugins.map((plugin) => {
    return {
      name: plugin,
      module: resolveFrom(file, plugin),
    };
  });
}

function filterDependency(dep: { [name: string]: string } | undefined) {
  if (dep) {
    return Object.keys(dep).filter((name) => PLUGIN_REGEX.test(name));
  }
  return [];
}
