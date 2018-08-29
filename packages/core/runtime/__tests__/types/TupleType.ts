import MS from '../../src';
import { PluginSystem } from '@manta-style/core';

describe('TupleType', () => {
  const context = { query: {}, plugins: PluginSystem.default() };
  test('mock', async () => {
    const tuple = MS.TupleType([MS.Literal(1), MS.Literal(2), MS.Literal(3)]);
    expect((await tuple.deriveLiteral([], context)).mock()).toEqual([1, 2, 3]);
  });
});
