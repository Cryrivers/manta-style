import MS from '../../src';

describe('TypeLiteral Test', () => {
  test('TypeLiteral can mock', async () => {
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
    const TestObject = GenericTypeLiteral.argumentTypes([MS.NumberKeyword]);
    const result = (await TestObject.deriveLiteral([])).mock();
    expect(typeof result.test === 'number').toBe(true);
  });
});
