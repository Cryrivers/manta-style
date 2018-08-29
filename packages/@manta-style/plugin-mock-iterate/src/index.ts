import { annotationUtils, MockPlugin } from '@manta-style/plugin-helper';

const generatorMap: {
  [key: string]: IterableIterator<string>;
} = {};

const fakerPlugin: MockPlugin = {
  name: 'iterate',
  mock: {
    StringType(annotations) {
      const jsdocIterate = annotationUtils.getAnnotationsByKey(
        'iterate',
        annotations,
      );
      if (jsdocIterate.length === 0) {
        return null;
      }

      const key = JSON.stringify(jsdocIterate);
      if (!(key in generatorMap)) {
        generatorMap[key] = createGenerator(jsdocIterate);
      }

      return String(generatorMap[key].next().value);
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
