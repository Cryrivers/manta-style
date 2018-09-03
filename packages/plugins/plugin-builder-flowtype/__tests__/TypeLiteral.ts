import getTranspiledString from '../src/utils/transpile';
import { BuilderPluginTestHelper } from '@manta-style/test-helpers';

const testTranspiledString = BuilderPluginTestHelper.testTranspiledString(
  getTranspiledString,
);

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
    expect(testTranspiledString(source)).toMatchSnapshot();
  });

  test('Object Indexer', () => {
    const source = `
        type Test = {
          [key: string]: number,
          a: string,
        }
      `;
    expect(testTranspiledString(source)).toMatchSnapshot();
  });
});
