import { getTranspiledString } from '../utils/transpiler';

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
