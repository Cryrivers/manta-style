import getTranspiledString from '../src/utils/transpile';
import { BuilderPluginTestHelper } from '@manta-style/test-helpers';

const testTranspiledString = BuilderPluginTestHelper.testTranspiledString(
  getTranspiledString,
);

describe('Tuple, Optional and Rest', () => {
  test('Tuple', () => {
    expect(
      testTranspiledString('type Test = [number, number]'),
    ).toMatchSnapshot();
  });
  test('Optional', () => {
    expect(
      testTranspiledString('type Test = [number, number, ?number]'),
    ).toMatchSnapshot();
  });
  xtest('Rest', () => {
    expect(
      testTranspiledString('type Test = [number, number, string]'),
    ).toMatchSnapshot();
  });
});
