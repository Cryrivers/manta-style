import MS from '../../src';

describe('ConditionalType', () => {
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
  test('DeriveLiteral: 1 extends number ? true : false / "haha" extends number ? true : false', () => {
    const expectedLiteralTrue = conditionNumber.deriveLiteral([]);
    const expectedLiteralFalse = conditionString.deriveLiteral([]);
    expect(expectedLiteralTrue).toBe(literalTrue);
    expect(expectedLiteralFalse).toBe(literalFalse);
  });
  test('Validate: 1 extends number ? true : false / "haha" extends number ? true : false', () => {
    expect(conditionNumber.validate(true)).toBe(true);
    expect(conditionString.validate(false)).toBe(true);
  });
});
