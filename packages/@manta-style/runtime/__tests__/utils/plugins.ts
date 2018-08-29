import MS from '../../src';
import { PluginSystem } from '@manta-style/core';
import ExamplePlugin from '@manta-style/plugin-mock-example';

describe('Test original @example annotation', () => {
  const context = {
    query: {},
    plugins: new PluginSystem([
      {
        name: '@manta-style/plugin-mock-example',
        module: ExamplePlugin,
      },
    ]),
  };
  test('Array can inherit @length from TypeAliasDeclaration', async () => {
    const type = MS.TypeAliasDeclaration(
      'Test',
      () => {
        return MS.ArrayType(MS.StringKeyword);
      },
      [{ key: 'length', value: '100' }, { key: 'example', value: 'yes' }],
    );
    const result = (await type.deriveLiteral([], context)).mock();
    expect(result).toHaveLength(100);
    expect(result).toEqual(Array.from(new Array(100), () => 'yes'));
  });
});
