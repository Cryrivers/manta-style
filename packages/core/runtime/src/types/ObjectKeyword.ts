import TypeLiteral from './TypeLiteral';
import { Type } from '@manta-style/core';

export default class ObjectKeyword extends Type {
  public deriveLiteral() {
    return new TypeLiteral();
  }
  public validate(value: unknown): value is object {
    return typeof value === 'object';
  }
}
