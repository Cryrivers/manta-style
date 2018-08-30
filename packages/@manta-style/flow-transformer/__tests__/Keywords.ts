import { getTranspiledString } from '../utils/transpiler';

describe('Keywords', () => {
  test('AnyKeyword', () => {
    expect(getTranspiledString('type Test = any;')).toMatchSnapshot();
  });
  test('NumberKeyword', () => {
    expect(getTranspiledString('type Test = number;')).toMatchSnapshot();
  });
  test('BooleanKeyword', () => {
    expect(getTranspiledString('type Test = boolean;')).toMatchSnapshot();
  });
  test('NeverKeyword', () => {
    expect(getTranspiledString('type Test = never;')).toMatchSnapshot();
  });
  test('ObjectKeyword', () => {
    expect(getTranspiledString('type Test = object;')).toMatchSnapshot();
  });
  test('StringKeyword', () => {
    expect(getTranspiledString('type Test = string;')).toMatchSnapshot();
  });
  test('UndefinedKeyword', () => {
    expect(getTranspiledString('type Test = undefined;')).toMatchSnapshot();
  });
  test('NullKeyword', () => {
    expect(getTranspiledString('type Test = null;')).toMatchSnapshot();
  });
});
