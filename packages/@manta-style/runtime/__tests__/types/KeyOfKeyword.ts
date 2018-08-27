import MS from '../../src';

describe('KeyOfKeyword', () => {
  test('Basic properties', async () => {
    const obj = MS.TypeLiteral((currentType) => {
      currentType.property('a', MS.NumberKeyword, false, []);
      currentType.property('b', MS.NumberKeyword, false, []);
      currentType.property('c', MS.NumberKeyword, false, []);
      currentType.property('d', MS.NumberKeyword, false, []);
    });
    const keyOfObj = MS.KeyOfKeyword(obj);
    const abcdUnion = await keyOfObj.deriveLiteral();
    expect(abcdUnion.getTypes().map((item) => item.mock())).toEqual([
      'a',
      'b',
      'c',
      'd',
    ]);
  });
});
