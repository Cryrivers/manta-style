import getTranspiledString from '../src/utils/transpile';
import { BuilderPluginTestHelper } from '@manta-style/test-helpers';

const testTranspiledString = BuilderPluginTestHelper.testTranspiledString(
  getTranspiledString,
);

describe('Keywords', () => {
  test('AnyKeyword', () => {
    expect(testTranspiledString('type Test = any;')).toMatchSnapshot();
  });
  test('NumberKeyword', () => {
    expect(testTranspiledString('type Test = number;')).toMatchSnapshot();
  });
  test('BooleanKeyword', () => {
    expect(testTranspiledString('type Test = boolean;')).toMatchSnapshot();
  });
  test('NeverKeyword', () => {
    expect(testTranspiledString('type Test = never;')).toMatchSnapshot();
  });
  test('ObjectKeyword', () => {
    expect(testTranspiledString('type Test = object;')).toMatchSnapshot();
  });
  test('StringKeyword', () => {
    expect(testTranspiledString('type Test = string;')).toMatchSnapshot();
  });
  test('UndefinedKeyword', () => {
    expect(testTranspiledString('type Test = undefined;')).toMatchSnapshot();
  });
  test('NullKeyword', () => {
    expect(testTranspiledString('type Test = null;')).toMatchSnapshot();
  });
});
