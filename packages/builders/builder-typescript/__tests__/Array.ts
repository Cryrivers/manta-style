import getTranspiledString from '../src/utils/transpile';
import { BuilderPluginTestHelper } from '@manta-style/test-helpers';

const testTranspiledString = BuilderPluginTestHelper.testTranspiledString(
  getTranspiledString,
);

describe('Array', () => {
  test('Bracket form', () => {
    expect(testTranspiledString('type Test = string[]')).toMatchSnapshot();
    expect(
      testTranspiledString('type Test = (number | string)[]'),
    ).toMatchSnapshot();
  });
  test('Array keyword form', () => {
    expect(
      testTranspiledString('type Test = Array<string>;'),
    ).toMatchSnapshot();
    expect(
      testTranspiledString('type Test = Array<number | string>;'),
    ).toMatchSnapshot();
    expect(testTranspiledString('type Test<T> = Array<T>;')).toMatchSnapshot();
  });
});
