import getTranspiledString from '../src/utils/transpile';

describe('Array', () => {
  test('Bracket form', () => {
    expect(getTranspiledString('type Test = string[]')).toMatchSnapshot();
    expect(
      getTranspiledString('type Test = (number | string)[]'),
    ).toMatchSnapshot();
  });
  test('Array keyword form', () => {
    expect(getTranspiledString('type Test = Array<string>;')).toMatchSnapshot();
    expect(
      getTranspiledString('type Test = Array<number | string>;'),
    ).toMatchSnapshot();
    expect(getTranspiledString('type Test<T> = Array<T>;')).toMatchSnapshot();
  });
});
