import Literal from './Literal';
import { Type } from '@manta-style/core';

export default class BooleanKeyword extends Type {
  public async deriveLiteral() {
    return new Literal(Math.random() >= 0.5);
  }
}
