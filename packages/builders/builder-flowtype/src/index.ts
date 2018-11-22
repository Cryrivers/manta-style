import { BuilderPlugin } from '@manta-style/core';
import build from './utils/build';
import transpile from './utils/transpile';

const typescriptBuilderPlugin: BuilderPlugin = {
  name: 'FlowType Builder',
  supportedExtensions: ['js'],
  async buildConfigFile({
    configFilePath,
    destDir,
    verbose,
    importHelpers,
    transpileModule,
  }) {
    const compiledFilePath = build(
      configFilePath,
      destDir,
      transpileModule,
      verbose,
      importHelpers,
    );
    if (compiledFilePath) {
      return compiledFilePath;
    } else {
      throw new Error(
        `FlowType Builder is unable to compile file ${configFilePath}.`,
      );
    }
  },
  async buildConfigSource(sourceCode) {
    return transpile(sourceCode);
  },
};

export { build, transpile };
export default typescriptBuilderPlugin;
