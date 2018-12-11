import MS from '../../src';

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
  test('Basic properties', () => {
    const abcdUnion = keyOfObj.deriveLiteral();
    expect(abcdUnion.getTypes().map((item) => item.mock())).toEqual([
      'a',
      'b',
      'c',
      'd',
    ]);
  });
  test('Validate', () => {
    expect(keyOfObj.validate('a')).toBe(true);
    expect(keyOfObj.validate('b')).toBe(true);
    expect(keyOfObj.validate('c')).toBe(true);
    expect(keyOfObj.validate('d')).toBe(true);
    expect(keyOfObj.validate('e')).toBe(false);
  });
});
