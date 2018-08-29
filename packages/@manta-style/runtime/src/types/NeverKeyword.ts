import { Type } from '@manta-style/core';

export default class NeverKeyword extends Type {
  public async deriveLiteral() {
    return this;
  }
}
