import { Type } from '@manta-style/core';

export default class NullKeyword extends Type {
  public deriveLiteral() {
    return this;
  }
  public mock() {
    return null;
  }
  public validate(value: unknown): value is null {
    return value === null;
  }
}
