import getTranspiledString from '../src/utils/transpile';
import { BuilderPluginTestHelper } from '@manta-style/test-helpers';

const testTranspiledString = BuilderPluginTestHelper.testTranspiledString(
  getTranspiledString,
);

describe('ReadOnly', () => {
  test('ReadOnly', () => {
    expect(
      testTranspiledString(
        'type A = {a: string, b: number}; type B = $ReadOnly<A>',
      ),
    ).toMatchSnapshot();
  });
});
