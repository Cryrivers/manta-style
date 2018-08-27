import MS from '../../src';

describe('OptionalType', () => {
  test('mock', async () => {
    const tuple = MS.TupleType([
      MS.Literal(1),
      MS.Literal(2),
      MS.OptionalType(MS.NumberKeyword),
    ]);
    const result = (await tuple.deriveLiteral([])).mock();
    expect(result.length === 2 || result.length === 3).toBe(true);
    expect(result[0]).toBe(1);
    expect(result[1]).toBe(2);
    expect(
      typeof result[2] === 'number' || typeof result[2] === 'undefined',
    ).toBe(true);
  });
});
