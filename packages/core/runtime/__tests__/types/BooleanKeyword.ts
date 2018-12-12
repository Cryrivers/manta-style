import MS from '../../src';

describe('Boolean Test', () => {
  const booleanKeyword = MS.BooleanKeyword;
  test('BooleanKeyword can mock', () => {
    const result = booleanKeyword.deriveLiteral([]).mock();
    expect(typeof result).toBe('boolean');
  });
  test('BooleanKeyword can validate', () => {
    expect(booleanKeyword.validate(3)).toBe(false);
    expect(booleanKeyword.validate({})).toBe(false);
    expect(booleanKeyword.validate('string')).toBe(false);
    expect(booleanKeyword.validate(false)).toBe(true);
    expect(booleanKeyword.validate([])).toBe(false);
    expect(booleanKeyword.validate('haha')).toBe(false);
  });
  test('BooleanKeyword can format', () => {
    expect(() => booleanKeyword.format(3)).toThrow();
    expect(booleanKeyword.format(1)).toBe(true);
    expect(booleanKeyword.format(0)).toBe(false);
    expect(booleanKeyword.format('')).toBe(false);
    expect(booleanKeyword.format(true)).toBe(true);
    expect(booleanKeyword.format(false)).toBe(false);
    expect(() => booleanKeyword.format('haha')).toThrow();
  });
});
