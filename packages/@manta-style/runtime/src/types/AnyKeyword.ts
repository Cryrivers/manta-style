import { Type } from "../utils/baseType";

export default class AnyKeyword extends Type {
  public deriveLiteralType() {
    return this;
  }
}
