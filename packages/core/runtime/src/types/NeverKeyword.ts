import { Type } from '@manta-style/core';

export default class NeverKeyword extends Type {
  public async deriveLiteral() {
    return this;
  }
  public validate(): never {
    throw Error('`never` keyword does not support `validate` method.');
  }
}
