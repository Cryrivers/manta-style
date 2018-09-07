import { annotationUtils, MockPlugin } from '@manta-style/core';
// @ts-ignore
import * as fetch from 'isomorphic-fetch';

const qotdPlugin: MockPlugin = {
  name: 'qotd',
  mock: {
    async StringType(annotations) {
      const jsdocRange = annotationUtils.getAnnotationsByKey(
        'qotd',
        annotations,
      );
      if (jsdocRange.length === 0) {
        return null;
      }

      try {
        const response = await fetch('https://talaikis.com/api/quotes/random/');
        const json = await response.json();
        return json.quote;
      } catch (e) {
        return null;
      }
    },
  },
};

export default qotdPlugin;
