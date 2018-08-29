import TypeLiteral from './TypeLiteral';
import { Type } from '@manta-style/core';

export default class ObjectKeyword extends Type {
  public async deriveLiteral() {
    return new TypeLiteral();
  }
}
