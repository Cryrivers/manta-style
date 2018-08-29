import { annotationUtils, MockPlugin } from '@manta-style/plugin-helper';
import { sample } from 'lodash-es';
import * as faker from 'faker';

const fakerPlugin: MockPlugin = {
  name: 'faker',
  mock: {
    StringType(annotations) {
      const jsdocExample = annotationUtils.getAnnotationsByKey(
        'example',
        annotations,
      );
      if (jsdocExample.length > 0) {
        const sampled = sample(jsdocExample);
        if (sampled) {
          return faker.fake(sampled);
        }
      }
      return null;
    },
  },
};

export default fakerPlugin;
