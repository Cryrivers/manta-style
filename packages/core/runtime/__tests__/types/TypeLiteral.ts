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
  test('format (simple case)', () => {
    /**
     * type TestGenerics = {
     *   zz: number
     * }
     */
    const TestSimple = MS.TypeAliasDeclaration(
      'TestSimple',
      () => {
        return MS.TypeLiteral((currentType) => {
          currentType.property('zz', MS.NumberKeyword, false, []);
        });
      },
      [],
    );
    expect(TestSimple.format({ zz: '333' })).toEqual({ zz: 333 });
    expect(TestSimple.format({ zz: 333 })).toEqual({ zz: 333 });
    expect(() => TestSimple.format({ zz: 'heihei' })).toThrow();
  });
  test('format (complex case)', () => {
    /*
   type TestGenerics = {
     zz: number
   }
   type TestFormat<T> = {
     heihei: {
       x: boolean,
       y: string
       z: T,
       a: 0 | 1 | '2'
     }
   }
  */
    const TestGenerics = MS.TypeAliasDeclaration(
      'TestGenerics',
      () => {
        return MS.TypeLiteral((currentType) => {
          currentType.property('zz', MS.NumberKeyword, false, []);
        });
      },
      [],
    );
    const TestFormat = MS.TypeAliasDeclaration(
      'TestFormat',
      (type) => {
        const T = type.TypeParameter('T');
        return MS.TypeLiteral((currentType) => {
          currentType.property(
            'heihei',
            MS.TypeLiteral((ct) => {
              ct.property('x', MS.BooleanKeyword, false, []);
              ct.property('y', MS.StringKeyword, false, []);
              ct.property('z', T, false, []);
              ct.property(
                'a',
                MS.UnionType([MS.Literal(0), MS.Literal(1), MS.Literal('2')]),
                false,
                [],
              );
            }),
            false,
            [],
          );
        });
      },
      [],
    );
    const TestObject = TestFormat.argumentTypes([TestGenerics]);
    expect(
      TestObject.format({ heihei: { x: 1, y: 222, z: { zz: '3' }, a: 2 } }),
    ).toEqual({
      heihei: {
        x: true,
        y: '222',
        z: {
          zz: 3,
        },
        a: '2',
      },
    });
  });
});
