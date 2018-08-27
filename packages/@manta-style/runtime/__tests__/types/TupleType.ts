import MS from '../../src';

describe('TupleType', () => {
  test('mock', async () => {
    const tuple = MS.TupleType([MS.Literal(1), MS.Literal(2), MS.Literal(3)]);
    expect((await tuple.deriveLiteral([])).mock()).toEqual([1, 2, 3]);
  });
});
