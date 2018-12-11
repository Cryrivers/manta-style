import MS from '../../src';

describe('NullKeyword', () => {
  test('mock', () => {
    expect(MS.NullKeyword.mock()).toBe(null);
  });
  test('validate', () => {
    expect(MS.NullKeyword.validate(null)).toBe(true);
  });
});
