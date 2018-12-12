import getTranspiledString from '../src/utils/transpile';
import { BuilderPluginTestHelper } from '@manta-style/test-helpers';

const testTranspiledString = BuilderPluginTestHelper.testTranspiledString(
  getTranspiledString,
);

describe('Enums', () => {
  test('Normal Enums', () => {
    expect(testTranspiledString('enum Test { A, B, C, D };')).toMatchSnapshot();
  });
  test('Enums with numeric initializer', () => {
    expect(
      testTranspiledString('enum Test { A, B = 12, C, D };'),
    ).toMatchSnapshot();
  });
  test('Enums with string initializer', () => {
    expect(
      testTranspiledString("enum Test { A = 'A', B = 'B', C = 'C', D = 'D' };"),
    ).toMatchSnapshot();
  });
});
