import MS from '../../src';
import ArrayLiteral from '../../src/types/ArrayLiteral';

// number[]
const type = MS.ArrayType(MS.NumberKeyword);

describe('AnyKeyword', () => {
  test('deriveLiteral', async () => {
    const literals = await type.deriveLiteral([]);
    expect(literals instanceof ArrayLiteral).toBe(true);
  });
  test('mock without annotations', async () => {
    const data = (await type.deriveLiteral([])).mock();
    expect(data.every((item) => typeof item === 'number')).toBe(true);
  });
  test('mock with annotation @length', async () => {
    const data = (await type.deriveLiteral([
      { key: 'length', value: '10' },
    ])).mock();
    expect(data.length).toBe(10);
  });
});
