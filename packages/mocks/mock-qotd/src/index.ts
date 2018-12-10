import { annotationUtils, MockPlugin, Fetcher } from '@manta-style/core';
// @ts-ignore
import * as fetch from 'isomorphic-fetch';

const qotdPlugin: MockPlugin = {
  name: 'qotd',
  mock: {
    // @ts-ignore
    StringType(annotations) {
      const jsdocRange = annotationUtils.getAnnotationsByKey(
        'qotd',
        annotations,
      );
      if (jsdocRange.length === 0) {
        return null;
      }

      try {
        // @ts-ignore
        return new Fetcher(
          fetch('https://talaikis.com/api/quotes/random/')
            .then((response) => response.json())
            .then((json) => json.quote),
        );
      } catch (e) {
        return null;
      }
    },
  },
};

export default qotdPlugin;
