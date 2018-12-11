import MS from '../../src';
import ArrayLiteral from '../../src/types/ArrayLiteral';

// number[]
const type = MS.ArrayType(MS.NumberKeyword);

describe('AnyKeyword', () => {
  test('deriveLiteral', () => {
    const literals = type.deriveLiteral([]);
    expect(literals instanceof ArrayLiteral).toBe(true);
  });
  test('mock without annotations', () => {
    const data = type.deriveLiteral([]).mock();
    expect(data.every((item) => typeof item === 'number')).toBe(true);
  });
  test('mock with annotation @length', () => {
    const data = type.deriveLiteral([{ key: 'length', value: '10' }]).mock();
    expect(data.length).toBe(10);
  });
  test('validate: ArrayType', () => {
    expect(type.validate(3)).toBe(false);
    expect(type.validate({})).toBe(false);
    expect(type.validate('hahah')).toBe(false);
    expect(type.validate(false)).toBe(false);
    expect(type.validate([])).toBe(true);
    expect(type.validate([1, 2, 3])).toBe(true);
    expect(type.validate([1, '2', 3])).toBe(false);
    expect(type.validate(['1', '2', '3'])).toBe(false);
  });
  test('validate: ArrayLiteral', () => {
    const arrayLiteralType = MS.ArrayLiteral([
      MS.Literal('a'),
      MS.Literal('b'),
      MS.Literal('c'),
    ]);
    expect(arrayLiteralType.validate(3)).toBe(false);
    expect(arrayLiteralType.validate({})).toBe(false);
    expect(arrayLiteralType.validate('hahah')).toBe(false);
    expect(arrayLiteralType.validate(false)).toBe(false);
    expect(arrayLiteralType.validate([])).toBe(false);
    expect(arrayLiteralType.validate([1, 2, 3])).toBe(false);
    expect(arrayLiteralType.validate([1, '2', 3])).toBe(false);
    expect(arrayLiteralType.validate(['1', '2', '3'])).toBe(false);
    expect(arrayLiteralType.validate(['a', 'b', 'c'])).toBe(true);
  });
});
