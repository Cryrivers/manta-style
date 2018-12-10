import MS from '../../src';
import { PluginSystem } from '@manta-style/core';

describe('Boolean Test', () => {
  const booleanKeyword = MS.BooleanKeyword;
  const context = { query: {}, param: {}, plugins: PluginSystem.default() };
  test('BooleanKeyword can mock', () => {
    const result = booleanKeyword.deriveLiteral([], context).mock();
    expect(typeof result).toBe('boolean');
  });
  test('BooleanKeyword can validate', () => {
    expect(booleanKeyword.validate(3)).toBe(false);
    expect(booleanKeyword.validate({})).toBe(false);
    expect(booleanKeyword.validate('string')).toBe(false);
    expect(booleanKeyword.validate(false)).toBe(true);
    expect(booleanKeyword.validate([])).toBe(false);
    expect(booleanKeyword.validate('haha')).toBe(false);
  });
});
