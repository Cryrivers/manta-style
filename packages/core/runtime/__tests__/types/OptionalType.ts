import MS from '../../src';
import { PluginSystem } from '@manta-style/core';

describe('OptionalType', () => {
  test('mock', () => {
    const tuple = MS.TupleType([
      MS.Literal(1),
      MS.Literal(2),
      MS.OptionalType(MS.NumberKeyword),
    ]);
    const result = tuple.deriveLiteral([]).mock();
    expect(result.length === 2 || result.length === 3).toBe(true);
    expect(result[0]).toBe(1);
    expect(result[1]).toBe(2);
    expect(
      typeof result[2] === 'number' || typeof result[2] === 'undefined',
    ).toBe(true);
  });
  test('validate', () => {
    /* type Tuple = ['haha', 'heihei', 'hoho'?] */
    const tuple = MS.TupleType([
      MS.Literal('haha'),
      MS.Literal('heihei'),
      MS.OptionalType(MS.Literal('hoho')),
    ]);
    expect(tuple.validate(['haha', 'heihei'])).toBe(true);
    expect(tuple.validate(['haha', 'heihei', 'hoho'])).toBe(true);
    expect(tuple.validate(['haha', 'heihei', 'lala'])).toBe(false);
    expect(tuple.validate(['haha'])).toBe(false);
  });
});
