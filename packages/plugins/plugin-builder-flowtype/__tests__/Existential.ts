import getTranspiledString from '../src/utils/transpile';

describe('Existential', () => {
  test('*', () => {
    expect(getTranspiledString('type Test = Type<*>')).toMatchSnapshot();
  });
});
