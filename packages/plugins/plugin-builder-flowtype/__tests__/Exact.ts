import getTranspiledString from '../src/utils/transpile';
import { BuilderPluginTestHelper } from '@manta-style/test-helpers';

const testTranspiledString = BuilderPluginTestHelper.testTranspiledString(
  getTranspiledString,
);

describe('Exact', () => {
  test('Exact', () => {
    expect(
      testTranspiledString(
        'type A = {a: string, b: number}; type B = $Exact<A>',
      ),
    ).toMatchSnapshot();
  });
});
