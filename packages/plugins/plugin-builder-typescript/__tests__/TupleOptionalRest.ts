import getTranspiledString from '../src/utils/transpile';

describe('Tuple, Optional and Rest', () => {
  test('Tuple', () => {
    expect(
      getTranspiledString('type Test = [number, number]'),
    ).toMatchSnapshot();
  });
  test('Optional', () => {
    expect(
      getTranspiledString('type Test = [number, number, number?]'),
    ).toMatchSnapshot();
  });
  test('Rest', () => {
    expect(
      getTranspiledString('type Test = [number, number, ...string[]]'),
    ).toMatchSnapshot();
  });
});
