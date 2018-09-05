import getTranspiledString from '../src/utils/transpile';
import { BuilderPluginTestHelper } from '@manta-style/test-helpers';

const testTranspiledString = BuilderPluginTestHelper.testTranspiledString(
  getTranspiledString,
);

describe('Existential', () => {
  test('*', () => {
    expect(testTranspiledString('type Test = Type<*>')).toMatchSnapshot();
  });
});
