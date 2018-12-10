import MS from '../../src';
import { PluginSystem } from '@manta-style/core';
import ExamplePlugin from '@manta-style/mock-example';

describe('Plugin Test', () => {
  test('Test original @example annotation', () => {
    const context = {
      query: {},
      param: {},
      plugins: new PluginSystem([
        {
          name: '@manta-style/mock-example',
          module: ExamplePlugin,
        },
      ]),
    };
    const type = MS.TypeAliasDeclaration(
      'Test',
      () => {
        return MS.ArrayType(MS.StringKeyword);
      },
      [{ key: 'length', value: '100' }, { key: 'example', value: 'yes' }],
    );
    const result = type.deriveLiteral([], context).mock();
    expect(result).toHaveLength(100);
    expect(result).toEqual(Array.from(new Array(100), () => 'yes'));
  });
});
