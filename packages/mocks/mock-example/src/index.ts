import { MockPlugin } from '@manta-style/core';
import { sample } from 'lodash-es';

const fakerPlugin: MockPlugin = {
  name: 'example',
  key: 'example',
  mock: {
    StringType(...examples) {
      if (examples.length > 0) {
        const sampled = sample(examples);
        if (sampled) {
          return sampled;
        }
      }
      return null;
    },
    NumberType(...examples) {
      const generatedNumber = sample(examples);
      return generatedNumber || null;
    },
  },
};

export default fakerPlugin;
