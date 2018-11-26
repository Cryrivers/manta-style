import MS from '../../src';
import { PluginSystem } from '@manta-style/core';

describe('TypeLiteral Test', () => {
  const context = { query: {}, param: {}, plugins: PluginSystem.default() };
  /*
   type GenericTypeLiteral<T> = {
     test: T
   }
  */
  const GenericTypeLiteral = MS.TypeAliasDeclaration(
    'GenericTypeLiteral',
    (type) => {
      const T = type.TypeParameter('T');
      return MS.TypeLiteral((currentType) => {
        currentType.property('test', T, false, []);
      });
    },
    [],
  );
  test('mock', async () => {
    const TestObject = GenericTypeLiteral.argumentTypes([MS.NumberKeyword]);
    const result = (await TestObject.deriveLiteral([], context)).mock();
    expect(typeof result.test === 'number').toBe(true);
  });
  test('validate (simple case)', async () => {
    const TestObject = GenericTypeLiteral.argumentTypes([MS.NumberKeyword]);
    expect(await TestObject.validate(3, context)).toBe(false);
    expect(await TestObject.validate({}, context)).toBe(false);
    expect(await TestObject.validate('hahah', context)).toBe(false);
    expect(await TestObject.validate(false, context)).toBe(false);
    expect(await TestObject.validate([], context)).toBe(false);
    expect(await TestObject.validate({ test: 'haha' }, context)).toBe(false);
    expect(await TestObject.validate({ test: 123 }, context)).toBe(true);
  });
});
