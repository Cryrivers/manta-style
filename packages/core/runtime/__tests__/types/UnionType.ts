import MS from '../../src';

describe('Union Type Test', () => {
  const union = MS.UnionType([
    MS.Literal('A'),
    MS.Literal('B'),
    MS.Literal('C'),
  ]);
  test('UnionType can mock', () => {
    const result = union.deriveLiteral([]).mock();
    expect(['A', 'B', 'C']).toContain(result);
  });
  test('UnionType can validate', () => {
    expect(union.validate('A')).toBe(true);
    expect(union.validate('B')).toBe(true);
    expect(union.validate('C')).toBe(true);
    expect(union.validate('D')).toBe(false);
  });
  test('UnionType can format', () => {
    expect(union.format('A')).toBe('A');
    expect(union.format('B')).toBe('B');
    expect(union.format('C')).toBe('C');
    expect(() => union.format('D')).toThrow();
  });
});
