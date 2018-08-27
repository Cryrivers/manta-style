import { isAssignable } from '../../src/utils/assignable';
import MS from '../../src';

describe('Assignablity Test', () => {
  test('String Keyword and literals', async () => {
    const LiteralA = MS.Literal('Hello');
    const LiteralB = MS.Literal('Hello');
    const LiteralC = MS.Literal('World');
    expect(await isAssignable(LiteralA, LiteralB)).toBe(true);
    expect(await isAssignable(LiteralA, LiteralC)).toBe(false);
    expect(await isAssignable(LiteralA, MS.StringKeyword)).toBe(true);
    expect(await isAssignable(LiteralC, MS.StringKeyword)).toBe(true);
  });
  test('Number Keyword and literals', async () => {
    const LiteralA = MS.Literal(0);
    const LiteralB = MS.Literal(0);
    const LiteralC = MS.Literal(1);
    expect(await isAssignable(LiteralA, LiteralB)).toBe(true);
    expect(await isAssignable(LiteralA, LiteralC)).toBe(false);
    expect(await isAssignable(LiteralA, MS.NumberKeyword)).toBe(true);
    expect(await isAssignable(LiteralC, MS.NumberKeyword)).toBe(true);
  });
  test('Boolean Keyword and literals', async () => {
    const LiteralA = MS.Literal(true);
    const LiteralB = MS.Literal(true);
    const LiteralC = MS.Literal(false);
    expect(await isAssignable(LiteralA, LiteralB)).toBe(true);
    expect(await isAssignable(LiteralA, LiteralC)).toBe(false);
    expect(await isAssignable(LiteralA, MS.BooleanKeyword)).toBe(true);
    expect(await isAssignable(LiteralC, MS.BooleanKeyword)).toBe(true);
  });
});
