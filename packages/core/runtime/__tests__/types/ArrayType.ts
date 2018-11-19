import MS from '../../src';
import ArrayLiteral from '../../src/types/ArrayLiteral';
import { PluginSystem } from '@manta-style/core';

// number[]
const type = MS.ArrayType(MS.NumberKeyword);

describe('AnyKeyword', () => {
  const context = { query: {}, param: {}, plugins: PluginSystem.default() };

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
  test('validate', async () => {
    expect(await type.validate(3, context)).toBe(false);
    expect(await type.validate({}, context)).toBe(false);
    expect(await type.validate('hahah', context)).toBe(false);
    expect(await type.validate(false, context)).toBe(false);
    expect(await type.validate([], context)).toBe(true);
    expect(await type.validate([1, 2, 3], context)).toBe(true);
    expect(await type.validate([1, '2', 3], context)).toBe(false);
    expect(await type.validate(['1', '2', '3'], context)).toBe(false);
  });
});
