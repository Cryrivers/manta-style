import * as prettier from 'prettier';

const prettierConfig: prettier.Options = {
  singleQuote: true,
  trailingComma: 'all',
  bracketSpacing: true,
  arrowParens: 'always',
  parser: 'babylon',
};

export const testTranspiledString = (
  getTranspiledString: (code: string) => string,
) => (code: string) => {
  return `FROM:
${code}

--------------------------------------------------------
TO:
${prettier.format(getTranspiledString(code), prettierConfig)}`;
};
