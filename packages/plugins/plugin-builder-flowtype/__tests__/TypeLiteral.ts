import getTranspiledString from '../src/utils/transpile';

describe('Type Literal', () => {
  test('Basic properties', () => {
    const source = `
        type Test = {
            a: number,
            b: 1,
            c?: string,
            d: string[]
        }
      `;
    expect(getTranspiledString(source)).toMatchSnapshot();
  });
});
