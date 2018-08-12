import { Annotation } from '../../src/utils/baseType';
import { inheritAnnotations } from '../../src/utils/annotation';
import MantaStyle from '../../src';

describe('Annotation Test', () => {
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
  test('Array can inherit @length from TypeAliasDeclaration', () => {
    const type = MantaStyle.TypeAliasDeclaration(
      'Test',
      () => {
        return MantaStyle.ArrayType(MantaStyle.StringKeyword);
      },
      [{ key: 'length', value: '100' }, { key: 'example', value: 'yes' }],
    );
    const result = type.deriveLiteral([]).mock();
    expect(result).toHaveLength(100);
    expect(result).toEqual(Array.from(new Array(100), () => 'yes'));
  });
});
