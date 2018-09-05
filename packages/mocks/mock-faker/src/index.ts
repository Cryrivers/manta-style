import { MockPlugin } from '@manta-style/core';
import * as faker from 'faker';

const fakerPlugin: MockPlugin = {
  name: 'faker',
  key: 'faker',
  mock: {
    StringType(fakerString) {
      console.log(fakerString);
      return faker.fake(fakerString);
    },
    NumberType(fakerString) {
      const pathToFake = fakerString.split('.');
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
      return null;
    },
  },
};

export default fakerPlugin;
