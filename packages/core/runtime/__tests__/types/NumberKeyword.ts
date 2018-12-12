import MS from '../../src';

describe('Number Test', () => {
  const numberKeyword = MS.NumberKeyword;
  test('NumberKeyword can mock', () => {
    const result = numberKeyword.deriveLiteral([]).mock();
    expect(typeof result).toBe('number');
  });
  test('Number can validate', () => {
    expect(numberKeyword.validate(3)).toBe(true);
    expect(numberKeyword.validate({})).toBe(false);
    expect(numberKeyword.validate('string')).toBe(false);
    expect(numberKeyword.validate(false)).toBe(false);
    expect(numberKeyword.validate([])).toBe(false);
    expect(numberKeyword.validate('haha')).toBe(false);
  });
  test('NumberKeyword can format', () => {
    expect(numberKeyword.format(3)).toBe(3);
    expect(numberKeyword.format('3')).toBe(3);
    expect(numberKeyword.format('3.1415')).toBe(3.1415);
    expect(numberKeyword.format('-3.1415')).toBe(-3.1415);
    expect(() => numberKeyword.format('3.14.15')).toThrow();
    expect(numberKeyword.format('')).toBe(0);
    expect(() => numberKeyword.format(true)).toThrow();
    expect(() => numberKeyword.format(false)).toThrow();
    expect(() => numberKeyword.format('haha')).toThrow();
  });
});
