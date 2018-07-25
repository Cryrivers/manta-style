import { Type } from "../utils/baseType";
import LiteralType from "./LiteralType";

export default class BooleanKeyword extends Type {
  public deriveLiteralType() {
    return Math.random() < 0.5 ? new LiteralType(false) : new LiteralType(true);
  }
}
