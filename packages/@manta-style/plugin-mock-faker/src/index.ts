import { getAnnotationsByKey } from '@manta-style/plugin-helper';
import { sample } from 'lodash-es'
import * as faker from 'faker';

module.exports = {
  name: 'faker',
  mock: {
    StringType(type: any, annotations: any) {
      const jsdocExample = getAnnotationsByKey('example', annotations);
      if (jsdocExample.length > 0) {
        const sampled = sample(jsdocExample);
        if (sampled) {
          return faker.fake(sampled);
        }
      }
      return null;
    }
  }
};