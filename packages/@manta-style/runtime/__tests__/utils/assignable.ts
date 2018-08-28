import { isAssignable } from '../../src/utils/assignable';
import MS from '../../src';
import PluginSystem from '@manta-style/plugin-system';

describe('Assignablity Test', () => {
  const context = { query: {}, plugins: PluginSystem.default() };

  test('String Keyword and literals', async () => {
    const LiteralA = MS.Literal('Hello');
    const LiteralB = MS.Literal('Hello');
    const LiteralC = MS.Literal('World');
    expect(await isAssignable(LiteralA, LiteralB, context)).toBe(true);
    expect(await isAssignable(LiteralA, LiteralC, context)).toBe(false);
    expect(await isAssignable(LiteralA, MS.StringKeyword, context)).toBe(true);
    expect(await isAssignable(LiteralC, MS.StringKeyword, context)).toBe(true);
  });
  test('Number Keyword and literals', async () => {
    const LiteralA = MS.Literal(0);
    const LiteralB = MS.Literal(0);
    const LiteralC = MS.Literal(1);
    expect(await isAssignable(LiteralA, LiteralB, context)).toBe(true);
    expect(await isAssignable(LiteralA, LiteralC, context)).toBe(false);
    expect(await isAssignable(LiteralA, MS.NumberKeyword, context)).toBe(true);
    expect(await isAssignable(LiteralC, MS.NumberKeyword, context)).toBe(true);
  });
  test('Boolean Keyword and literals', async () => {
    const LiteralA = MS.Literal(true);
    const LiteralB = MS.Literal(true);
    const LiteralC = MS.Literal(false);
    expect(await isAssignable(LiteralA, LiteralB, context)).toBe(true);
    expect(await isAssignable(LiteralA, LiteralC, context)).toBe(false);
    expect(await isAssignable(LiteralA, MS.BooleanKeyword, context)).toBe(true);
    expect(await isAssignable(LiteralC, MS.BooleanKeyword, context)).toBe(true);
  });
});
