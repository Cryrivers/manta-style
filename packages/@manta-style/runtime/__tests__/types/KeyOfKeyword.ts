import MS from '../../src';
import PluginSystem from '@manta-style/plugin-system';

describe('KeyOfKeyword', () => {
  const context = { query: {}, plugins: PluginSystem.default() };
  test('Basic properties', async () => {
    const obj = MS.TypeLiteral((currentType) => {
      currentType.property('a', MS.NumberKeyword, false, []);
      currentType.property('b', MS.NumberKeyword, false, []);
      currentType.property('c', MS.NumberKeyword, false, []);
      currentType.property('d', MS.NumberKeyword, false, []);
    });
    const keyOfObj = MS.KeyOfKeyword(obj);
    const abcdUnion = await keyOfObj.deriveLiteral([], context);
    expect(abcdUnion.getTypes().map((item) => item.mock())).toEqual([
      'a',
      'b',
      'c',
      'd',
    ]);
  });
});
