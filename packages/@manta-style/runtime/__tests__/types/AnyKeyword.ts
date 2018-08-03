import MS from '../../src';

describe('AnyKeyword', () => {
  test('deriveLiteral', () => {
    expect(MS.AnyKeyword.deriveLiteral()).toBe(MS.AnyKeyword);
  });
  test('mock', () => {
    expect(MS.AnyKeyword.mock).toThrowError();
  });
});
