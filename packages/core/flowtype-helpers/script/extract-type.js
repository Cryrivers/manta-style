// @ts-check
const { extractExportName } = require('@manta-style/helpers-builder');
const path = require('path');
extractExportName(
  path.join(__dirname, '../src/index.ts'),
  path.join(__dirname, '../../flowtype-helpers-types/src/index.ts'),
);
