import { isAssignable } from '../../src/utils/assignable';
import MS from '../../src';
import { PluginSystem } from '@manta-style/core';

describe('Assignablity Test', () => {
  const context = { query: {}, param: {}, plugins: PluginSystem.default() };

  test('String Keyword and literals', () => {
    const LiteralA = MS.Literal('Hello');
    const LiteralB = MS.Literal('Hello');
    const LiteralC = MS.Literal('World');
    expect(isAssignable(LiteralA, LiteralB, context)).toBe(true);
    expect(isAssignable(LiteralA, LiteralC, context)).toBe(false);
    expect(isAssignable(LiteralA, MS.StringKeyword, context)).toBe(true);
    expect(isAssignable(LiteralC, MS.StringKeyword, context)).toBe(true);
  });
  test('Number Keyword and literals', () => {
    const LiteralA = MS.Literal(0);
    const LiteralB = MS.Literal(0);
    const LiteralC = MS.Literal(1);
    expect(isAssignable(LiteralA, LiteralB, context)).toBe(true);
    expect(isAssignable(LiteralA, LiteralC, context)).toBe(false);
    expect(isAssignable(LiteralA, MS.NumberKeyword, context)).toBe(true);
    expect(isAssignable(LiteralC, MS.NumberKeyword, context)).toBe(true);
  });
  test('Boolean Keyword and literals', () => {
    const LiteralA = MS.Literal(true);
    const LiteralB = MS.Literal(true);
    const LiteralC = MS.Literal(false);
    expect(isAssignable(LiteralA, LiteralB, context)).toBe(true);
    expect(isAssignable(LiteralA, LiteralC, context)).toBe(false);
    expect(isAssignable(LiteralA, MS.BooleanKeyword, context)).toBe(true);
    expect(isAssignable(LiteralC, MS.BooleanKeyword, context)).toBe(true);
  });
});
