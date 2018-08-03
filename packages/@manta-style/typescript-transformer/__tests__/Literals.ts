import { getTranspiledString } from '../utils/transpiler';

describe('Literals', () => {
  test('Numbers', () => {
    expect(getTranspiledString('type Test = 1;')).toMatchSnapshot();
  });
  test('Strings', () => {
    expect(getTranspiledString('type Test = "test";')).toMatchSnapshot();
  });
  test('Booleans', () => {
    expect(getTranspiledString('type Test = true;')).toMatchSnapshot();
    expect(getTranspiledString('type Test = false;')).toMatchSnapshot();
  });
  test('Array of literals', () => {
    expect(
      getTranspiledString('type Test = [1, 2, 3, "hello", "world"];'),
    ).toMatchSnapshot();
  });
});
