import MS from '../../src';
import UnionType from '../../src/types/UnionType';

describe('IndexedAccessType', () => {
  test('mock: Basic T[K], where T is an object', () => {
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
    const literalOne = indexedAccess.deriveLiteral([]);
    expect(literalOne.mock()).toEqual(1);
    expect(literalOne.validate(1)).toBe(true);
    expect(literalOne.validate(2)).toBe(false);
  });
  test('mock: T[keyof T]; a.k.a $Values<T>, where T is an object', () => {
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
    const result = indexedAccess.deriveLiteral([]);
    expect(result instanceof UnionType).toBe(true);
    if (result instanceof UnionType) {
      expect(result.getTypes().map((item) => item.mock())).toEqual([1, 2]);
    } else {
      throw Error('Result is not a UnionType.');
    }
    expect(result.validate(1)).toBe(true);
    expect(result.validate(2)).toBe(true);
    expect(result.validate(3)).toBe(false);
  });
  test('mock: T[K], where K is a union of strings', () => {
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
    const unionOneOrTwo = indexedAccess.deriveLiteral([]);
    expect([1, 2].includes(unionOneOrTwo.deriveLiteral([]).mock())).toBe(true);
    expect(unionOneOrTwo.validate(1)).toBe(true);
    expect(unionOneOrTwo.validate(2)).toBe(true);
  });
});
