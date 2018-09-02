import getTranspiledString from '../src/utils/transpile';

describe('Type Reference', () => {
  test('Reference Type (Non-generic)', () => {
    expect(
      getTranspiledString('type A = string; type B = A;'),
    ).toMatchSnapshot();
  });
  test('Reference Type (Generic)', () => {
    expect(
      getTranspiledString('type A<T> = string | T; type B = A<number>;'),
    ).toMatchSnapshot();
  });
});
