import MS from '../../src';

describe('Literals Test', () => {
  const stringLiteral = MS.Literal('haha');
  const numberLikeStringLiteral = MS.Literal('3');
  test('Literal can mock', () => {
    const result = stringLiteral.deriveLiteral().mock();
    expect(result).toBe('haha');
  });
  test('Literal can validate', () => {
    expect(stringLiteral.validate(3)).toBe(false);
    expect(stringLiteral.validate({})).toBe(false);
    expect(stringLiteral.validate('string')).toBe(false);
    expect(stringLiteral.validate(false)).toBe(false);
    expect(stringLiteral.validate([])).toBe(false);
    expect(stringLiteral.validate('haha')).toBe(true);
  });
  test('Literal can format', () => {
    expect(numberLikeStringLiteral.format(3)).toBe('3');
  });
});
