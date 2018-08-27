import { Type } from '../utils/baseType';

export default class NeverKeyword extends Type {
  public async deriveLiteral() {
    return this;
  }
}
