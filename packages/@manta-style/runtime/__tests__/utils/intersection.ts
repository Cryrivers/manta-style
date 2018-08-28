import { intersection } from '../../src/utils/intersection';
import MS from '../../src';
import PluginSystem from '@manta-style/plugin-system';

describe('Intersection Test', () => {
  const context = { query: {}, plugins: PluginSystem.default() };

  test('number & number = number', async () => {
    expect(
      await intersection(MS.NumberKeyword, MS.NumberKeyword, context),
    ).toBe(MS.NumberKeyword);
  });
  test('number & 1 = 1', async () => {
    const LiteralOne = MS.Literal(1);
    expect(await intersection(MS.NumberKeyword, LiteralOne, context)).toBe(
      LiteralOne,
    );
  });
  test('number & 1 = 1 & number', async () => {
    const LiteralOne = MS.Literal(1);
    expect(await intersection(MS.NumberKeyword, LiteralOne, context)).toBe(
      await intersection(LiteralOne, MS.NumberKeyword, context),
    );
  });
  test('number & (1 | 2) = 1 | 2', async () => {
    const OneTwoUnion = MS.UnionType([MS.Literal(1), MS.Literal(2)]);
    expect(await intersection(MS.NumberKeyword, OneTwoUnion, context)).toBe(
      OneTwoUnion,
    );
  });
  test('number & boolean = never', async () => {
    expect(
      await intersection(MS.NumberKeyword, MS.BooleanKeyword, context),
    ).toBe(MS.NeverKeyword);
  });
  test('(number | string) & string = string', async () => {
    const numberStringUnion = MS.UnionType([
      MS.NumberKeyword,
      MS.StringKeyword,
    ]);
    expect(
      await intersection(numberStringUnion, MS.StringKeyword, context),
    ).toBe(MS.StringKeyword);
  });
  test('{ a: number } & { b: number } = { a:number, b:number }', async () => {
    const objA = MS.TypeLiteral((currentType) => {
      currentType.property('a', MS.NumberKeyword, false, []);
    });
    const objB = MS.TypeLiteral((currentType) => {
      currentType.property('b', MS.NumberKeyword, false, []);
    });
    const objC = await intersection(objA, objB, context);
    const mockData = (await objC.deriveLiteral([], context)).mock();
    expect(Object.keys(mockData)).toEqual(['a', 'b']);
  });
});
