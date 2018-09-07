import { annotationUtils, MockPlugin } from '@manta-style/core';
import { sample } from 'lodash-es';

const fakerPlugin: MockPlugin = {
  name: 'example',
  mock: {
    StringType(annotations) {
      const jsdocExample = annotationUtils.getAnnotationsByKey(
        'example',
        annotations,
      );
      if (jsdocExample.length > 0) {
        const sampled = sample(jsdocExample);
        if (sampled) {
          return sampled;
        }
      }
      return null;
    },
    NumberType(annotations) {
      const precisionAnnotation = annotationUtils.getAnnotationsByKey(
        'precision',
        annotations,
      );

      const precision =
        precisionAnnotation.length > 0 ? parseInt(precisionAnnotation[0]) : 0;
      const generatedNumber = annotationUtils.getNumberFromAnnotationKey({
        key: 'example',
        precision,
        annotations,
      });
      return generatedNumber || null;
    },
  },
};

export default fakerPlugin;
