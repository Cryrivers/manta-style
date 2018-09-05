import getTranspiledString from '../src/utils/transpile';
import { BuilderPluginTestHelper } from '@manta-style/test-helpers';

const testTranspiledString = BuilderPluginTestHelper.testTranspiledString(
  getTranspiledString,
);

describe('Annotation', () => {
  test('Annotation', () => {
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
  test('Handles { and }, escaped bracket', () => {
    expect(
      testTranspiledString(`type A = {
      /**
       * @mantastyle {{ plugin "\\{\\{foo\\}\\}" }}
       */
      a: string;
      /**
       * @mantastyle {{ plugin "\\{\\{foo\\}\\} \\{\\{bar\\}\\}" }}
       */
      b: number;
    };`),
    ).toMatchSnapshot();
  });

  test('Handles }} in other annotation', () => {
    expect(
      testTranspiledString(`type A = {
      /**
       * @mantastyle {{ plugin "\\{\\{foo\\}\\}" }}
       * @random {{}}
       */
      a: string;
      /**
       * @mantastyle {{ plugin "\\{\\{foo\\}\\} \\{\\{bar\\}\\}" }}
       * @random {{}}
       */
      b: number;
    };`),
    ).toMatchSnapshot();
  });
});
