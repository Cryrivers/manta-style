import { intersection } from '../../src/utils/intersection';
import MS from '../../src';

describe('Intersection Test', () => {
  test('number & number = number', () => {
    expect(intersection(MS.NumberKeyword, MS.NumberKeyword)).toBe(
      MS.NumberKeyword,
    );
  });
  test('number & 1 = 1', () => {
    const LiteralOne = MS.Literal(1);
    expect(intersection(MS.NumberKeyword, LiteralOne)).toBe(LiteralOne);
  });
  test('number & 1 = 1 & number', () => {
    const LiteralOne = MS.Literal(1);
    expect(intersection(MS.NumberKeyword, LiteralOne)).toBe(
      intersection(LiteralOne, MS.NumberKeyword),
    );
  });
  test('number & (1 | 2) = 1 | 2', () => {
    const OneTwoUnion = MS.UnionType([MS.Literal(1), MS.Literal(2)]);
    expect(intersection(MS.NumberKeyword, OneTwoUnion)).toBe(OneTwoUnion);
  });
  test('number & boolean = never', () => {
    expect(intersection(MS.NumberKeyword, MS.BooleanKeyword)).toBe(
      MS.NeverKeyword,
    );
  });
  test('(number | string) & string = string', () => {
    const numberStringUnion = MS.UnionType([
      MS.NumberKeyword,
      MS.StringKeyword,
    ]);
    expect(intersection(numberStringUnion, MS.StringKeyword)).toBe(
      MS.StringKeyword,
    );
  });
  test('{ a: number } & { b: number } = { a:number, b:number }', () => {
    const objA = MS.TypeLiteral((currentType) => {
      currentType.property('a', MS.NumberKeyword, false, []);
    });
    const objB = MS.TypeLiteral((currentType) => {
      currentType.property('b', MS.NumberKeyword, false, []);
    });
    const objC = intersection(objA, objB);
    const mockData = objC.deriveLiteral().mock();
    expect(Object.keys(mockData)).toEqual(['a', 'b']);
  });
});
