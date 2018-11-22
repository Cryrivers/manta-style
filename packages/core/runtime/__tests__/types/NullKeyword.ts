import MS from '../../src';

describe('NullKeyword', () => {
  test('mock', () => {
    expect(MS.NullKeyword.mock()).toBe(null);
  });
  test('validate', async () => {
    expect(await MS.NullKeyword.validate(null)).toBe(true);
  });
});
