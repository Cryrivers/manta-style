import MS from '../../src';
import { PluginSystem } from '@manta-style/core';
import ExamplePlugin from '@manta-style/plugin-mock-example';

describe('Plugin Test', () => {
  test('Test original @example annotation', async () => {
    const context = {
      query: {},
      plugins: new PluginSystem([
        {
          name: '@manta-style/plugin-mock-example',
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
    const result = (await type.deriveLiteral([], context)).mock();
    expect(result).toHaveLength(100);
    expect(result).toEqual(Array.from(new Array(100), () => 'yes'));
  });
});
