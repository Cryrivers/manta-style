import { Type } from "../utils/baseType";

export default class UndefinedKeyword extends Type {
  public deriveLiteralType() {
    return this;
  }
  public mock() {
    return undefined;
  }
}
