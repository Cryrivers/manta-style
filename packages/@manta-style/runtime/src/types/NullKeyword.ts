import { Type } from "../utils/baseType";

export default class NullKeyword extends Type {
  public deriveLiteralType() {
    return this;
  }
  public mock() {
    return null;
  }
}
