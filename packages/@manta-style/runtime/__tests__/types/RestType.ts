import MS from '../../src';

describe('RestType', () => {
  test('mock', async () => {
    const tuple = MS.TupleType([
      MS.Literal(1),
      MS.Literal(2),
      MS.RestType(MS.StringKeyword),
    ]);
    const result = (await tuple.deriveLiteral([])).mock();
    const [, , ...strings] = result;
    expect(result.length).toBeGreaterThan(2);
    expect(result[0]).toBe(1);
    expect(result[1]).toBe(2);
    expect(strings.every((item) => typeof item === 'string')).toBe(true);
  });
});
