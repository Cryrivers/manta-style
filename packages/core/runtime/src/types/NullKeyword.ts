import { Type } from '@manta-style/core';

export default class NullKeyword extends Type {
  public async deriveLiteral() {
    return this;
  }
  public mock() {
    return null;
  }
}
