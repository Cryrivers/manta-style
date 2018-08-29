import MS from '../../src';
import { PluginSystem } from '@manta-style/core';

describe('ConditionalType', () => {
  const context = { query: {}, plugins: PluginSystem.default() };
  test('1 extends number ? true : false / "haha" extends number ? true : false', async () => {
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
    const expectedTypeNumber = await conditionNumber.deriveLiteral([], context);
    const expectedTypeString = await conditionString.deriveLiteral([], context);
    expect(expectedTypeNumber).toBe(literalTrue);
    expect(expectedTypeString).toBe(literalFalse);
  });
});
