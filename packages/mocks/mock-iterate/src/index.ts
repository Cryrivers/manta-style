import { MockPlugin } from '@manta-style/core';

const generatorMap: {
  [key: string]: IterableIterator<string>;
} = {};

const fakerPlugin: MockPlugin = {
  name: 'iterate',
  key: 'iterate',
  lazy: true,
  mock: {
    StringType(...examples) {
      const key = JSON.stringify(examples);
      if (!(key in generatorMap)) {
        generatorMap[key] = createGenerator(examples);
      }

      return generatorMap[key].next().value;
    },
  },
};

function* createGenerator(list: Array<string>) {
  let i = 0;
  while (true) {
    yield list[i];
    i = (i + 1) % list.length;
  }
}

export default fakerPlugin;
