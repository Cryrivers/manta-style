import getTranspiledString from '../src/utils/transpile';
import { BuilderPluginTestHelper } from '@manta-style/test-helpers';

const testTranspiledString = BuilderPluginTestHelper.testTranspiledString(
  getTranspiledString,
);

describe('Annotation', () => {
  test('jsdoc parser', () => {
    expect(
      testTranspiledString(`
    /**
     * @mantastyle {{ asdf asdf asdf }}
     * 
     * @example 12345 67890
     * @iterate 23456 34567
     *
     */
    type Test = {};
    `),
    ).toMatchSnapshot();
  });
});
