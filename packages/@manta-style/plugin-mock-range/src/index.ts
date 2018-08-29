import { annotationUtils, MockPlugin } from '@manta-style/plugin-helper';
import { sample } from 'lodash-es';

const RANGE_REGEX = /^\s*(\d+)\s+(\d+)\s*$/;

const fakerPlugin: MockPlugin = {
  name: 'range',
  mock: {
    NumberType(annotations) {
      const jsdocRange = annotationUtils.getAnnotationsByKey(
        'range',
        annotations,
      );
      if (jsdocRange.length === 0) {
        return null;
      }

      const sampled = sample(jsdocRange);
      if (!sampled) {
        return null;
      }

      const minMaxMatch = sampled.match(RANGE_REGEX);
      if (!minMaxMatch) {
        return null;
      }

      const [_, min, max] = minMaxMatch;
      return Math.round(Math.random() * (+max - +min)) + +min;
    },
  },
};

export default fakerPlugin;
