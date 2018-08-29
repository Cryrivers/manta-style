import { Type } from '@manta-style/core';

export default class UndefinedKeyword extends Type {
  public async deriveLiteral() {
    return this;
  }
  public mock() {
    return undefined;
  }
}
