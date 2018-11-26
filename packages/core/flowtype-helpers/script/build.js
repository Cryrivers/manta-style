// @ts-check
const { build } = require('@manta-style/builder-typescript');
const path = require('path');
build({
  fileName: path.join(__dirname, '..', 'src', 'index.ts'),
  destDir: path.join(__dirname, '..', 'lib'),
  verbose: true,
  transpileModule: true,
  importHelpers: false,
});
