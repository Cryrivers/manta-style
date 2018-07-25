import { Type } from "../utils/baseType";

export default class NeverKeyword extends Type {
  public neverType: boolean = true;
  public deriveLiteralType() {
    return this;
  }
}
