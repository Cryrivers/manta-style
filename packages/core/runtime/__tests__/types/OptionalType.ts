import MS from '../../src';
import { PluginSystem } from '@manta-style/core';

describe('OptionalType', () => {
  const context = { query: {}, plugins: PluginSystem.default() };
  test('mock', async () => {
    const tuple = MS.TupleType([
      MS.Literal(1),
      MS.Literal(2),
      MS.OptionalType(MS.NumberKeyword),
    ]);
    const result = (await tuple.deriveLiteral([], context)).mock();
    expect(result.length === 2 || result.length === 3).toBe(true);
    expect(result[0]).toBe(1);
    expect(result[1]).toBe(2);
    expect(
      typeof result[2] === 'number' || typeof result[2] === 'undefined',
    ).toBe(true);
  });
});
