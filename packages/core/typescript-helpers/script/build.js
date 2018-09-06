// @ts-check
const { build } = require('@manta-style/builder-typescript');
const path = require('path');
build(
  path.join(__dirname, '..', 'src', 'index.ts'),
  path.join(__dirname, '..', 'lib'),
  true,
  false,
  true,
);
