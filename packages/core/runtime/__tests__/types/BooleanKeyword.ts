import MS from '../../src';
import { PluginSystem } from '@manta-style/core';

describe('Boolean Test', () => {
  const booleanKeyword = MS.BooleanKeyword;
  const context = { query: {}, param: {}, plugins: PluginSystem.default() };
  test('BooleanKeyword can mock', async () => {
    const result = (await booleanKeyword.deriveLiteral([], context)).mock();
    expect(typeof result).toBe('boolean');
  });
  test('BooleanKeyword can validate', async () => {
    expect(await booleanKeyword.validate(3)).toBe(false);
    expect(await booleanKeyword.validate({})).toBe(false);
    expect(await booleanKeyword.validate('string')).toBe(false);
    expect(await booleanKeyword.validate(false)).toBe(true);
    expect(await booleanKeyword.validate([])).toBe(false);
    expect(await booleanKeyword.validate('haha')).toBe(false);
  });
});
