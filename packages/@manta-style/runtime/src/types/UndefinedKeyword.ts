import { Type } from '../utils/baseType';

export default class UndefinedKeyword extends Type {
  public deriveLiteral() {
    return this;
  }
  public mock() {
    return undefined;
  }
}
