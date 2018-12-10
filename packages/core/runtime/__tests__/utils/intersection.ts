import { intersection } from '../../src/utils/intersection';
import MS from '../../src';
import { PluginSystem } from '@manta-style/core';

describe('Intersection Test', () => {
  const context = { query: {}, param: {}, plugins: PluginSystem.default() };

  test('number & number = number', () => {
    expect(intersection(MS.NumberKeyword, MS.NumberKeyword, context)).toBe(
      MS.NumberKeyword,
    );
  });
  test('number & 1 = 1', () => {
    const LiteralOne = MS.Literal(1);
    expect(intersection(MS.NumberKeyword, LiteralOne, context)).toBe(
      LiteralOne,
    );
  });
  test('number & 1 = 1 & number', () => {
    const LiteralOne = MS.Literal(1);
    expect(intersection(MS.NumberKeyword, LiteralOne, context)).toBe(
      intersection(LiteralOne, MS.NumberKeyword, context),
    );
  });
  test('number & (1 | 2) = 1 | 2', () => {
    const OneTwoUnion = MS.UnionType([MS.Literal(1), MS.Literal(2)]);
    expect(intersection(MS.NumberKeyword, OneTwoUnion, context)).toBe(
      OneTwoUnion,
    );
  });
  test('number & boolean = never', () => {
    expect(intersection(MS.NumberKeyword, MS.BooleanKeyword, context)).toBe(
      MS.NeverKeyword,
    );
  });
  test('(number | string) & string = string', () => {
    const numberStringUnion = MS.UnionType([
      MS.NumberKeyword,
      MS.StringKeyword,
    ]);
    expect(intersection(numberStringUnion, MS.StringKeyword, context)).toBe(
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
    const objC = intersection(objA, objB, context);
    const mockData = objC.deriveLiteral([], context).mock();
    expect(Object.keys(mockData)).toEqual(['a', 'b']);
  });
});
