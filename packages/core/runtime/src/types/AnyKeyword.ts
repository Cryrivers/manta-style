import { Type } from '@manta-style/core';

export default class AnyKeyword extends Type {
  public deriveLiteral() {
    return this;
  }
  public validate(value: unknown): value is any {
    return true;
  }
  public format(value: unknown) {
    return value;
  }
}
