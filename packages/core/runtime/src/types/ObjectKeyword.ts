import TypeLiteral from './TypeLiteral';
import { Type } from '@manta-style/core';

export default class ObjectKeyword extends Type {
  public async deriveLiteral() {
    return new TypeLiteral();
  }
  public async validate(value: unknown) {
    return typeof value === 'object';
  }
}
