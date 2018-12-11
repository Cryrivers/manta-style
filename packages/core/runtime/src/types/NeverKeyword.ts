import { Type } from '@manta-style/core';

export default class NeverKeyword extends Type {
  public deriveLiteral() {
    return this;
  }
  public validate(value: any): value is never {
    throw new Error('`never` keyword does not support `validate` method.');
  }
}
