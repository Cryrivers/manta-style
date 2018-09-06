import getTranspiledString from '../src/utils/transpile';
import { BuilderPluginTestHelper } from '@manta-style/test-helpers';

const testTranspiledString = BuilderPluginTestHelper.testTranspiledString(
  getTranspiledString,
);

describe('NonMaybeType', () => {
  test('NonMaybeType', () => {
    expect(
      testTranspiledString('type A = ?number; type B = $NonMaybeType<A>'),
    ).toMatchSnapshot();
  });

  test('NonMaybeType', () => {
    expect(
      testTranspiledString('type A = number | null; type B = $NonMaybeType<A>'),
    ).toMatchSnapshot();
  });
});
