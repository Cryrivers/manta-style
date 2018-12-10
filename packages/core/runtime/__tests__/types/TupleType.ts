import MS from '../../src';
import { PluginSystem } from '@manta-style/core';

describe('TupleType', () => {
  const context = { query: {}, param: {}, plugins: PluginSystem.default() };
  test('mock', () => {
    const tuple = MS.TupleType([MS.Literal(1), MS.Literal(2), MS.Literal(3)]);
    expect(tuple.deriveLiteral([], context).mock()).toEqual([1, 2, 3]);
  });
});
