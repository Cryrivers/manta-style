import { MockPlugin } from '@manta-style/core';
const rangePlugin: MockPlugin = {
  name: 'range',
  key: 'range',
  mock: {
    NumberType(min, max = Number.MAX_SAFE_INTEGER) {
      return Math.round(Math.random() * (+max - +min)) + +min;
    },
  },
};

export default rangePlugin;
