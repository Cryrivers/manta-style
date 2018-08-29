import MS from '../../src';
import { PluginSystem, annotationUtils, Annotation } from '@manta-style/core';

const { inheritAnnotations } = annotationUtils;

describe('Annotation Test', () => {
  const context = { query: {}, plugins: PluginSystem.default() };

  test('Inherit Annotations', () => {
    const parent: Annotation[] = [
      { key: 'length', value: '0' },
      { key: 'length', value: '2' },
      { key: 'example', value: 'cool' },
    ];
    const child: Annotation[] = [{ key: 'length', value: '1' }];
    const result = inheritAnnotations(parent, child);
    expect(result).toEqual([
      {
        key: 'example',
        value: 'cool',
      },
      { key: 'length', value: '1' },
    ]);
  });
  test('Array can inherit @length from TypeAliasDeclaration', async () => {
    const type = MS.TypeAliasDeclaration(
      'Test',
      () => {
        return MS.ArrayType(MS.StringKeyword);
      },
      [{ key: 'length', value: '100' }],
    );
    const result = (await type.deriveLiteral([], context)).mock();
    expect(result).toHaveLength(100);
    expect(result).toEqual(
      Array.from(
        new Array(100),
        () => 'This is a string message. Customize it with JSDoc tag @example',
      ),
    );
  });
  test('resolveReferencedType could correctly inherit annotations #1', async () => {
    /*
     * type GenericType<T> = T;
     * type SingleType = number;
     * // @length 20
     * type ArrayType = SingleType[];
     * type TestObject = GenericType<ArrayType>;
     */
    const GenericType = MS.TypeAliasDeclaration(
      'GenericType',
      (type) => type.TypeParameter('T'),
      [],
    );
    const SingleType = MS.TypeAliasDeclaration(
      'SingleType',
      () => MS.NumberKeyword,
      [],
    );
    const ArrayType = MS.TypeAliasDeclaration(
      'ArrayType',
      () => MS.ArrayType(SingleType),
      [{ key: 'length', value: '20' }],
    );
    const TestObject = MS.TypeAliasDeclaration(
      'TestObject',
      () => GenericType.argumentTypes([ArrayType]),
      [],
    );
    const result = (await TestObject.deriveLiteral([], context)).mock();
    expect(result).toHaveLength(20);
  });
  test('resolveReferencedType could correctly inherit annotations #2', async () => {
    /*
     * type GenericType<T> = T;
     * type SingleType = number;
     * type ArrayType = SingleType[];
     * // @length 20
     * type TestObject = GenericType<ArrayType>;
     */
    const GenericType = MS.TypeAliasDeclaration(
      'GenericType',
      (type) => type.TypeParameter('T'),
      [],
    );
    const SingleType = MS.TypeAliasDeclaration(
      'SingleType',
      () => MS.NumberKeyword,
      [],
    );
    const ArrayType = MS.TypeAliasDeclaration(
      'ArrayType',
      () => MS.ArrayType(SingleType),
      [],
    );
    const TestObject = MS.TypeAliasDeclaration(
      'TestObject',
      () => GenericType.argumentTypes([ArrayType]),
      [{ key: 'length', value: '20' }],
    );
    const result = (await TestObject.deriveLiteral([], context)).mock();
    expect(result).toHaveLength(20);
  });
});
