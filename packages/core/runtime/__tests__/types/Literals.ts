import MS from '../../src';

describe('Literals Test', () => {
  const stringLiteral = MS.Literal('haha');
  test('Literal can mock', async () => {
    const result = (await stringLiteral.deriveLiteral()).mock();
    expect(result).toBe('haha');
  });
  test('Literal can validate', async () => {
    expect(await stringLiteral.validate(3)).toBe(false);
    expect(await stringLiteral.validate({})).toBe(false);
    expect(await stringLiteral.validate('string')).toBe(false);
    expect(await stringLiteral.validate(false)).toBe(false);
    expect(await stringLiteral.validate([])).toBe(false);
    expect(await stringLiteral.validate('haha')).toBe(true);
  });
});
