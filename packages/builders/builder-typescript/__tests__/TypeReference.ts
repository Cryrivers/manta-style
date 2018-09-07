import getTranspiledString from '../src/utils/transpile';
import { BuilderPluginTestHelper } from '@manta-style/test-helpers';

const testTranspiledString = BuilderPluginTestHelper.testTranspiledString(
  getTranspiledString,
);

describe('Type Reference', () => {
  test('Reference Type (Non-generic)', () => {
    expect(
      testTranspiledString('type A = string; type B = A;'),
    ).toMatchSnapshot();
  });
  test('Reference Type (Generic)', () => {
    expect(
      testTranspiledString('type A<T> = string | T; type B = A<number>;'),
    ).toMatchSnapshot();
  });
});
