import MS from '../../src';
import {
  PluginSystem,
  flushFetcher,
  usePluginSystem,
  resetContext,
} from '@manta-style/core';
import ExamplePlugin from '@manta-style/mock-example';
import QotdPlugin from '@manta-style/mock-qotd';

describe('Plugin Test', () => {
  test('Test original @example annotation', () => {
    const [, setPlugins] = usePluginSystem();
    setPlugins(
      new PluginSystem([
        {
          name: '@manta-style/mock-example',
          module: ExamplePlugin,
        },
      ]),
    );

    const type = MS.TypeAliasDeclaration(
      'Test',
      () => {
        return MS.ArrayType(MS.StringKeyword);
      },
      [{ key: 'length', value: '100' }, { key: 'example', value: 'yes' }],
    );

    const result = type.deriveLiteral([]).mock();
    expect(result).toHaveLength(100);
    expect(result).toEqual(Array.from(new Array(100), () => 'yes'));
    resetContext();
  });
  test('Test Async Plugin', async () => {
    const [, setPlugins] = usePluginSystem();
    setPlugins(
      new PluginSystem([
        {
          name: '@manta-style/mock-qotd',
          module: QotdPlugin,
        },
      ]),
    );
    const type = MS.TypeAliasDeclaration(
      'Test',
      () => {
        return MS.ArrayType(MS.StringKeyword);
      },
      [{ key: 'length', value: '1' }, { key: 'qotd', value: '' }],
    );
    const result = type.deriveLiteral([]);
    await flushFetcher();
    const mockData = result.mock();
    expect(mockData).toHaveLength(1);
    expect(typeof mockData[0]).toBe('string');
    resetContext();
  });
});
