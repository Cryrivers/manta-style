import MS from '../../src';
import { PluginSystem } from '@manta-style/core';
import UnionType from '../../src/types/UnionType';

describe('IndexedAccessType', () => {
  const context = { query: {}, param: {}, plugins: PluginSystem.default() };
  test('mock: Basic T[K], where T is an object', async () => {
    /*
        type obj = {
            a:1,
            b:2
        }
        type indexedAccess = obj['a'] // should be 1
    */
    const obj = MS.TypeLiteral((currentType) => {
      currentType.property('a', MS.Literal(1), false, []);
      currentType.property('b', MS.Literal(2), false, []);
    });
    const indexedAccess = MS.IndexedAccessType(obj, MS.Literal('a'));
    const literalOne = await indexedAccess.deriveLiteral([], context);
    expect(literalOne.mock()).toEqual(1);
    expect(await literalOne.validate(1, context)).toBe(true);
    expect(await literalOne.validate(2, context)).toBe(false);
  });
  test('mock: T[keyof T]; a.k.a $Values<T>, where T is an object', async () => {
    /*
        type obj = {
            a:1,
            b:2
        }
        type keyOfObj = keyof obj; // 'a' | 'b'
        type indexedAccess = obj[keyOfObj]; // 1 | 2
    */
    const obj = MS.TypeLiteral((currentType) => {
      currentType.property('a', MS.Literal(1), false, []);
      currentType.property('b', MS.Literal(2), false, []);
    });
    const keyOfObj = MS.KeyOfKeyword(obj);
    const indexedAccess = MS.IndexedAccessType(obj, keyOfObj);
    const result = await indexedAccess.deriveLiteral([], context);
    expect(result instanceof UnionType).toBe(true);
    if (result instanceof UnionType) {
      expect(result.getTypes().map((item) => item.mock())).toEqual([1, 2]);
    } else {
      throw Error('Result is not a UnionType.');
    }
    expect(await result.validate(1, context)).toBe(true);
    expect(await result.validate(2, context)).toBe(true);
    expect(await result.validate(3, context)).toBe(false);
  });
  test('mock: T[K], where K is a union of strings', async () => {
    /*
        type obj = string;
        type indexedAccess = obj['a'] // should be `string`
    */
    const obj = MS.TypeLiteral((currentType) => {
      currentType.property('a', MS.Literal(1), false, []);
      currentType.property('b', MS.Literal(2), false, []);
    });
    const indexedAccess = MS.IndexedAccessType(
      obj,
      MS.UnionType([MS.Literal('a'), MS.Literal('b')]),
    );
    const unionOneOrTwo = await indexedAccess.deriveLiteral([], context);
    expect(
      [1, 2].includes((await unionOneOrTwo.deriveLiteral([], context)).mock()),
    ).toBe(true);
    expect(await unionOneOrTwo.validate(1, context)).toBe(true);
    expect(await unionOneOrTwo.validate(2, context)).toBe(true);
  });
});
