import MS from '../../src';
import ArrayLiteral from '../../src/types/ArrayLiteral';
import PluginSystem from '@manta-style/plugin-system';

// number[]
const type = MS.ArrayType(MS.NumberKeyword);

describe('AnyKeyword', () => {
  const context = { query: {}, plugins: PluginSystem.default() };

  test('deriveLiteral', async () => {
    const literals = await type.deriveLiteral([], context);
    expect(literals instanceof ArrayLiteral).toBe(true);
  });
  test('mock without annotations', async () => {
    const data = (await type.deriveLiteral([], context)).mock();
    expect(data.every((item) => typeof item === 'number')).toBe(true);
  });
  test('mock with annotation @length', async () => {
    const data = (await type.deriveLiteral(
      [{ key: 'length', value: '10' }],
      context,
    )).mock();
    expect(data.length).toBe(10);
  });
});
