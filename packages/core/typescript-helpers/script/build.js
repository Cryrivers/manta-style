// @ts-check
const { build } = require('@manta-style/plugin-builder-typescript');
const path = require('path');
build(
  path.join(__dirname, '..', 'src', 'index.ts'),
  path.join(__dirname, '..', 'lib'),
  true,
  false,
);
