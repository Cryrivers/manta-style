import MS from '../../src';

describe('AnyKeyword', () => {
  test('deriveLiteral', async () => {
    expect(await MS.AnyKeyword.deriveLiteral()).toBe(MS.AnyKeyword);
  });
  test('mock', () => {
    expect(MS.AnyKeyword.mock).toThrowError();
  });
  test('validate', async () => {
    expect(await MS.AnyKeyword.validate(3)).toBe(true);
    expect(await MS.AnyKeyword.validate({})).toBe(true);
    expect(await MS.AnyKeyword.validate('hahah')).toBe(true);
    expect(await MS.AnyKeyword.validate(false)).toBe(true);
    expect(await MS.AnyKeyword.validate([])).toBe(true);
  });
});
