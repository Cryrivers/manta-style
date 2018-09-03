import getTranspiledString from '../src/utils/transpile';
import { BuilderPluginTestHelper } from '@manta-style/test-helpers';

const testTranspiledString = BuilderPluginTestHelper.testTranspiledString(
  getTranspiledString,
);

describe('Literals', () => {
  test('Numbers', () => {
    expect(testTranspiledString('type Test = 1;')).toMatchSnapshot();
  });
  test('Strings', () => {
    expect(testTranspiledString('type Test = "test";')).toMatchSnapshot();
  });
  test('Booleans', () => {
    expect(testTranspiledString('type Test = true;')).toMatchSnapshot();
    expect(testTranspiledString('type Test = false;')).toMatchSnapshot();
  });
  test('Array of literals', () => {
    expect(
      testTranspiledString('type Test = [1, 2, 3, "hello", "world"];'),
    ).toMatchSnapshot();
  });
});
