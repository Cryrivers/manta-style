import MS from '../../src';

describe('AnyKeyword', () => {
  test('deriveLiteral', () => {
    expect(MS.AnyKeyword.deriveLiteral()).toBe(MS.AnyKeyword);
  });
  test('mock', () => {
    expect(MS.AnyKeyword.mock).toThrowError();
  });
  test('validate', () => {
    expect(MS.AnyKeyword.validate(3)).toBe(true);
    expect(MS.AnyKeyword.validate({})).toBe(true);
    expect(MS.AnyKeyword.validate('hahah')).toBe(true);
    expect(MS.AnyKeyword.validate(false)).toBe(true);
    expect(MS.AnyKeyword.validate([])).toBe(true);
  });
});
