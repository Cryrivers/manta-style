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
    expect(testTranspiledString('type Test = void;')).toMatchSnapshot();
  });
  test('ObjectKeyword', () => {
    expect(testTranspiledString('type Test = Object;')).toMatchSnapshot();
  });
  test('StringKeyword', () => {
    expect(testTranspiledString('type Test = string;')).toMatchSnapshot();
  });
  test('UndefinedKeyword', () => {
    expect(testTranspiledString('type Test = undefined;')).toMatchSnapshot();
  });
  test('EmptyKeyword', () => {
    expect(testTranspiledString('type Test = empty;')).toMatchSnapshot();
  });
  test('NullKeyword', () => {
    expect(testTranspiledString('type Test = null;')).toMatchSnapshot();
  });
});
