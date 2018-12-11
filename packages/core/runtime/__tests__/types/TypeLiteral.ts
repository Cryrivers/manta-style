import MS from '../../src';

describe('TypeLiteral Test', () => {
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
    const result = TestObject.deriveLiteral([]).mock();
    expect(typeof result.test === 'number').toBe(true);
  });
  test('validate (simple case)', () => {
    const TestObject = GenericTypeLiteral.argumentTypes([MS.NumberKeyword]);
    expect(TestObject.validate(3)).toBe(false);
    expect(TestObject.validate({})).toBe(false);
    expect(TestObject.validate('hahah')).toBe(false);
    expect(TestObject.validate(false)).toBe(false);
    expect(TestObject.validate([])).toBe(false);
    expect(TestObject.validate({ test: 'haha' })).toBe(false);
    expect(TestObject.validate({ test: 123 })).toBe(true);
  });
});
