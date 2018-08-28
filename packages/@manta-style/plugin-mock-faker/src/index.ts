import { annotationUtils, lodashUtils } from '@manta-style/plugin-helper';
import * as faker from 'faker';

module.exports = {
  name: 'faker',
  mock: {
    StringType(annotations: any) {
      const jsdocExample = annotationUtils.getAnnotationsByKey(
        'example',
        annotations,
      );
      if (jsdocExample.length > 0) {
        const sampled = lodashUtils.sample(jsdocExample);
        if (sampled) {
          return faker.fake(sampled);
        }
      }
      return null;
    },
  },
};
