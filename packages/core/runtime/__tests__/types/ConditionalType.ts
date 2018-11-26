import MS from '../../src';
import { PluginSystem } from '@manta-style/core';

describe('ConditionalType', () => {
  const context = { query: {}, param: {}, plugins: PluginSystem.default() };
  const literalOne = MS.Literal(1);
  const literalHaha = MS.Literal('haha');
  const literalTrue = MS.Literal(true);
  const literalFalse = MS.Literal(false);
  const conditionNumber = MS.ConditionalType(
    literalOne,
    MS.NumberKeyword,
    literalTrue,
    literalFalse,
  );
  const conditionString = MS.ConditionalType(
    literalHaha,
    MS.NumberKeyword,
    literalTrue,
    literalFalse,
  );
  test('DeriveLiteral: 1 extends number ? true : false / "haha" extends number ? true : false', async () => {
    const expectedLiteralTrue = await conditionNumber.deriveLiteral(
      [],
      context,
    );
    const expectedLiteralFalse = await conditionString.deriveLiteral(
      [],
      context,
    );
    expect(expectedLiteralTrue).toBe(literalTrue);
    expect(expectedLiteralFalse).toBe(literalFalse);
  });
  test('Validate: 1 extends number ? true : false / "haha" extends number ? true : false', async () => {
    expect(await conditionNumber.validate(true, context)).toBe(true);
    expect(await conditionString.validate(false, context)).toBe(true);
  });
});
