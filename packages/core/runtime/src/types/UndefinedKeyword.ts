import { Type } from '@manta-style/core';

export default class UndefinedKeyword extends Type {
  public deriveLiteral() {
    return this;
  }
  public mock() {
    return undefined;
  }
  public validate(value: unknown): value is undefined {
    return typeof value === 'undefined';
  }
}
