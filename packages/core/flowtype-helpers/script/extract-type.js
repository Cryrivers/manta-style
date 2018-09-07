// @ts-check
const { extractExportName } = require('@manta-style/helpers-builder');
const path = require('path');
const { execSync } = require('child_process');

const input = path.join(__dirname, '../src/index.ts');
const output = path.join(
  __dirname,
  '../../../builders/builder-flowtype/src/utils/builtin-types.ts',
);

console.log('Generating "flowtype-helpers-types"');
extractExportName(input, output);

try {
  execSync(`git add ${output}`, { cwd: process.env.INIT_CWD });
} catch (ex) {
  // Empty
}

console.log(`${output} generated.`);
