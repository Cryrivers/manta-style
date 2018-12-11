import TypeLiteral from './TypeLiteral';
import { Type } from '@manta-style/core';

export default class ObjectKeyword extends Type {
  public deriveLiteral() {
    return new TypeLiteral();
  }
  public validate(value: unknown): value is object {
    return typeof value === 'object';
  }
  public format(value: unknown) {
    if (typeof value === 'object') {
      return value;
    } else {
      return {};
    }
  }
}
