import MS from '../../src';
import { PluginSystem } from '@manta-style/core';

describe('KeyOfKeyword', () => {
  /* type Obj = { a:number, b:number, c:number, d:number } */
  const obj = MS.TypeLiteral((currentType) => {
    currentType.property('a', MS.NumberKeyword, false, []);
    currentType.property('b', MS.NumberKeyword, false, []);
    currentType.property('c', MS.NumberKeyword, false, []);
    currentType.property('d', MS.NumberKeyword, false, []);
  });
  /* type KeyOfObj = keyof Obj */
  const keyOfObj = MS.KeyOfKeyword(obj);
  const context = { query: {}, param: {}, plugins: PluginSystem.default() };
  test('Basic properties', async () => {
    const abcdUnion = await keyOfObj.deriveLiteral([], context);
    expect(abcdUnion.getTypes().map((item) => item.mock())).toEqual([
      'a',
      'b',
      'c',
      'd',
    ]);
  });
  test('Validate', async () => {
    expect(await keyOfObj.validate('a', context)).toBe(true);
    expect(await keyOfObj.validate('b', context)).toBe(true);
    expect(await keyOfObj.validate('c', context)).toBe(true);
    expect(await keyOfObj.validate('d', context)).toBe(true);
    expect(await keyOfObj.validate('e', context)).toBe(false);
  });
});
