import getTranspiledString from '../src/utils/transpile';
import { BuilderPluginTestHelper } from '@manta-style/test-helpers';

const testTranspiledString = BuilderPluginTestHelper.testTranspiledString(
  getTranspiledString,
);

describe('Shape', () => {
  test('Shape', () => {
    expect(
      testTranspiledString(
        'type A = {a: string, b: number}; type B = $Shape<A>',
      ),
    ).toMatchSnapshot();
  });
});
