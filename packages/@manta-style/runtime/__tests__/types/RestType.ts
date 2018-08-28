import MS from '../../src';
import PluginSystem from '@manta-style/plugin-system';

describe('RestType', () => {
  const context = { query: {}, plugins: PluginSystem.default() };
  test('mock', async () => {
    const tuple = MS.TupleType([
      MS.Literal(1),
      MS.Literal(2),
      MS.RestType(MS.StringKeyword),
    ]);
    const result = (await tuple.deriveLiteral([], context)).mock();
    const [, , ...strings] = result;
    expect(result.length).toBeGreaterThan(2);
    expect(result[0]).toBe(1);
    expect(result[1]).toBe(2);
    expect(strings.every((item) => typeof item === 'string')).toBe(true);
  });
});
