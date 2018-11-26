import { Type } from '@manta-style/core';

export default class AnyKeyword extends Type {
  public async deriveLiteral() {
    return this;
  }
  public async validate(value: unknown) {
    return true;
  }
}
