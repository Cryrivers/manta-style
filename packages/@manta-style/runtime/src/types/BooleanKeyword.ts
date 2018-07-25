import { Type } from "../utils/baseType";
import Literal from "./Literal";

export default class BooleanKeyword extends Type {
  public deriveLiteralType() {
    return new Literal(Math.random() < 0.5 ? false : true);
  }
}
