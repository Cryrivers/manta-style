import { annotationUtils, MockPlugin } from '@manta-style/core';
import { sample } from 'lodash-es';
import * as faker from 'faker';

const fakerPlugin: MockPlugin = {
  name: 'faker',
  mock: {
    StringType(annotations) {
      console.log('annotations', annotations);
      const jsdocExample = annotationUtils.getAnnotationsByKey(
        'faker',
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
    NumberType(annotations) {
      console.log('annotations', annotations);
      const jsdocExample = annotationUtils.getAnnotationsByKey(
        'faker',
        annotations,
      );
      if (jsdocExample.length > 0) {
        const sampled = sample(jsdocExample);
        if (sampled) {
          const pathToFake = sampled.split('.');
          let fakeValue = faker;
          for (const path of pathToFake) {
            // @ts-ignore
            fakeValue = fakeValue && fakeValue[path];
          }
          if (fakeValue != null) {
            if (typeof fakeValue === 'function') {
              // @ts-ignore
              fakeValue = fakeValue();
            }
            return Number(fakeValue);
          }
        }
      }
      return null;
    },
  },
};

export default fakerPlugin;
