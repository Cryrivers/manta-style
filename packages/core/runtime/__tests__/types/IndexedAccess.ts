import MS from '../../src';
import { PluginSystem } from '@manta-style/core';
import UnionType from '../../src/types/UnionType';

describe('IndexedAccessType', () => {
  const context = { query: {}, plugins: PluginSystem.default() };
  test('Basic T[K]', async () => {
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
  });
  test('T[keyof T]; a.k.a $Values<T>', async () => {
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
  });
});
