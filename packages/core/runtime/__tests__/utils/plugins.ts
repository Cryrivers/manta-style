import MS from '../../src';
import { PluginSystem, flushFetcher } from '@manta-style/core';
import ExamplePlugin from '@manta-style/mock-example';
import QotdPlugin from '@manta-style/mock-qotd';

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
  test('Test Async Plugin', async () => {
    const context = {
      query: {},
      param: {},
      plugins: new PluginSystem([
        {
          name: '@manta-style/mock-qotd',
          module: QotdPlugin,
        },
      ]),
    };
    const type = MS.TypeAliasDeclaration(
      'Test',
      () => {
        return MS.ArrayType(MS.StringKeyword);
      },
      [{ key: 'length', value: '1' }, { key: 'qotd', value: '' }],
    );
    const result = type.deriveLiteral([], context);
    await flushFetcher();
    const mockData = result.mock();
    expect(typeof mockData).toBe('string');
    expect(mockData).toHaveLength(1);
  });
});
