import { isAssignable } from '../../src/utils/assignable';
import MS from '../../src';

describe('Assignablity Test', () => {
  test('String Keyword and literals', () => {
    const LiteralA = MS.Literal('Hello');
    const LiteralB = MS.Literal('Hello');
    const LiteralC = MS.Literal('World');
    expect(isAssignable(LiteralA, LiteralB)).toBe(true);
    expect(isAssignable(LiteralA, LiteralC)).toBe(false);
    expect(isAssignable(LiteralA, MS.StringKeyword)).toBe(true);
    expect(isAssignable(LiteralC, MS.StringKeyword)).toBe(true);
  });
  test('Number Keyword and literals', () => {
    const LiteralA = MS.Literal(0);
    const LiteralB = MS.Literal(0);
    const LiteralC = MS.Literal(1);
    expect(isAssignable(LiteralA, LiteralB)).toBe(true);
    expect(isAssignable(LiteralA, LiteralC)).toBe(false);
    expect(isAssignable(LiteralA, MS.NumberKeyword)).toBe(true);
    expect(isAssignable(LiteralC, MS.NumberKeyword)).toBe(true);
  });
  test('Boolean Keyword and literals', () => {
    const LiteralA = MS.Literal(true);
    const LiteralB = MS.Literal(true);
    const LiteralC = MS.Literal(false);
    expect(isAssignable(LiteralA, LiteralB)).toBe(true);
    expect(isAssignable(LiteralA, LiteralC)).toBe(false);
    expect(isAssignable(LiteralA, MS.BooleanKeyword)).toBe(true);
    expect(isAssignable(LiteralC, MS.BooleanKeyword)).toBe(true);
  });
});
