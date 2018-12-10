import MS from '../../src';
import ArrayLiteral from '../../src/types/ArrayLiteral';
import { PluginSystem } from '@manta-style/core';

// number[]
const type = MS.ArrayType(MS.NumberKeyword);

describe('AnyKeyword', () => {
  const context = { query: {}, param: {}, plugins: PluginSystem.default() };

  test('deriveLiteral', () => {
    const literals = type.deriveLiteral([], context);
    expect(literals instanceof ArrayLiteral).toBe(true);
  });
  test('mock without annotations', () => {
    const data = type.deriveLiteral([], context).mock();
    expect(data.every((item) => typeof item === 'number')).toBe(true);
  });
  test('mock with annotation @length', () => {
    const data = type
      .deriveLiteral([{ key: 'length', value: '10' }], context)
      .mock();
    expect(data.length).toBe(10);
  });
  test('validate: ArrayType', () => {
    expect(type.validate(3, context)).toBe(false);
    expect(type.validate({}, context)).toBe(false);
    expect(type.validate('hahah', context)).toBe(false);
    expect(type.validate(false, context)).toBe(false);
    expect(type.validate([], context)).toBe(true);
    expect(type.validate([1, 2, 3], context)).toBe(true);
    expect(type.validate([1, '2', 3], context)).toBe(false);
    expect(type.validate(['1', '2', '3'], context)).toBe(false);
  });
  test('validate: ArrayLiteral', () => {
    const arrayLiteralType = MS.ArrayLiteral([
      MS.Literal('a'),
      MS.Literal('b'),
      MS.Literal('c'),
    ]);
    expect(arrayLiteralType.validate(3, context)).toBe(false);
    expect(arrayLiteralType.validate({}, context)).toBe(false);
    expect(arrayLiteralType.validate('hahah', context)).toBe(false);
    expect(arrayLiteralType.validate(false, context)).toBe(false);
    expect(arrayLiteralType.validate([], context)).toBe(false);
    expect(arrayLiteralType.validate([1, 2, 3], context)).toBe(false);
    expect(arrayLiteralType.validate([1, '2', 3], context)).toBe(false);
    expect(arrayLiteralType.validate(['1', '2', '3'], context)).toBe(false);
    expect(arrayLiteralType.validate(['a', 'b', 'c'], context)).toBe(true);
  });
});
