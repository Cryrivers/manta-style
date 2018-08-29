import MS from '../../src';

describe('AnyKeyword', () => {
  test('deriveLiteral', async () => {
    expect(await MS.AnyKeyword.deriveLiteral()).toBe(MS.AnyKeyword);
  });
  test('mock', () => {
    expect(MS.AnyKeyword.mock).toThrowError();
  });
});
