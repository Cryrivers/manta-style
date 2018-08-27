import { intersection } from '../../src/utils/intersection';
import MS from '../../src';

describe('Intersection Test', () => {
  test('number & number = number', async () => {
    expect(await intersection(MS.NumberKeyword, MS.NumberKeyword)).toBe(
      MS.NumberKeyword,
    );
  });
  test('number & 1 = 1', async () => {
    const LiteralOne = MS.Literal(1);
    expect(await intersection(MS.NumberKeyword, LiteralOne)).toBe(LiteralOne);
  });
  test('number & 1 = 1 & number', async () => {
    const LiteralOne = MS.Literal(1);
    expect(await intersection(MS.NumberKeyword, LiteralOne)).toBe(
      await intersection(LiteralOne, MS.NumberKeyword),
    );
  });
  test('number & (1 | 2) = 1 | 2', async () => {
    const OneTwoUnion = MS.UnionType([MS.Literal(1), MS.Literal(2)]);
    expect(await intersection(MS.NumberKeyword, OneTwoUnion)).toBe(OneTwoUnion);
  });
  test('number & boolean = never', async () => {
    expect(await intersection(MS.NumberKeyword, MS.BooleanKeyword)).toBe(
      MS.NeverKeyword,
    );
  });
  test('(number | string) & string = string', async () => {
    const numberStringUnion = MS.UnionType([
      MS.NumberKeyword,
      MS.StringKeyword,
    ]);
    expect(await intersection(numberStringUnion, MS.StringKeyword)).toBe(
      MS.StringKeyword,
    );
  });
  test('{ a: number } & { b: number } = { a:number, b:number }', async () => {
    const objA = MS.TypeLiteral((currentType) => {
      currentType.property('a', MS.NumberKeyword, false, []);
    });
    const objB = MS.TypeLiteral((currentType) => {
      currentType.property('b', MS.NumberKeyword, false, []);
    });
    const objC = await intersection(objA, objB);
    const mockData = (await objC.deriveLiteral([])).mock();
    expect(Object.keys(mockData)).toEqual(['a', 'b']);
  });
});
