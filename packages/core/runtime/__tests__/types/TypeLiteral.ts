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
  test('mock', () => {
    const TestObject = GenericTypeLiteral.argumentTypes([MS.NumberKeyword]);
    const result = TestObject.deriveLiteral([], context).mock();
    expect(typeof result.test === 'number').toBe(true);
  });
  test('validate (simple case)', () => {
    const TestObject = GenericTypeLiteral.argumentTypes([MS.NumberKeyword]);
    expect(TestObject.validate(3, context)).toBe(false);
    expect(TestObject.validate({}, context)).toBe(false);
    expect(TestObject.validate('hahah', context)).toBe(false);
    expect(TestObject.validate(false, context)).toBe(false);
    expect(TestObject.validate([], context)).toBe(false);
    expect(TestObject.validate({ test: 'haha' }, context)).toBe(false);
    expect(TestObject.validate({ test: 123 }, context)).toBe(true);
  });
});
