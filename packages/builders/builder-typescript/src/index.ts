import { BuilderPlugin } from '@manta-style/core';
import build from './utils/build';
import transpile from './utils/transpile';

const typescriptBuilderPlugin: BuilderPlugin = {
  name: 'TypeScript Builder',
  supportedExtensions: ['ts'],
  async buildConfigFile(configFilePath, destDir, verbose, importHelpers) {
    const compiledFilePath = build(
      configFilePath,
      destDir,
      verbose,
      importHelpers,
    );
    if (compiledFilePath) {
      return compiledFilePath;
    } else {
      throw new Error(
        `TypeScript Builder is unable to compile file ${configFilePath}.`,
      );
    }
  },
  async buildConfigSource(sourceCode) {
    return transpile(sourceCode);
  },
};

export { build, transpile };
export default typescriptBuilderPlugin;
