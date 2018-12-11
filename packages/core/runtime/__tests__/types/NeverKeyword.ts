import MS from '../../src';

describe('NeverKeyword', () => {
  test('mock', () => {
    expect(MS.NeverKeyword.mock).toThrowError();
  });
  test('validate', () => {
    expect(MS.NeverKeyword.validate).toThrowError();
  });
});
