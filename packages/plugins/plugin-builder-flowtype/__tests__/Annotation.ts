import getTranspiledString from '../src/utils/transpile';
import { BuilderPluginTestHelper } from '@manta-style/test-helpers';

const testTranspiledString = BuilderPluginTestHelper.testTranspiledString(
  getTranspiledString,
);

describe('Annotation', () => {
  test('Annotatin', () => {
    expect(
      testTranspiledString(`type A = {
      /**
       * @mantastyle {{ plugin a b c }}
       */
      a: string;
      /**
       * @mantastyle {{ multiline a
       *  b
       *  c }}
       */
      b: number;
    };`),
    ).toMatchSnapshot();
  });
});
