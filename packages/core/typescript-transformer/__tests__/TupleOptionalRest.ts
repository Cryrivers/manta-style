import { getTranspiledString } from '../utils/transpiler';

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
