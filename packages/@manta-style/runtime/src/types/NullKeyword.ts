import { Type } from '../utils/baseType';

export default class NullKeyword extends Type {
  public deriveLiteral() {
    return this;
  }
  public mock() {
    return null;
  }
}
