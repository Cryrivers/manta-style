import { Type } from "../utils/baseType";

export default class AnyKeyword extends Type {
  public mock() {
    throw new Error("Keyword `any` cannot be mocked");
  }
  public validate() {
    return true;
  }
}
