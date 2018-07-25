import { Type } from "../utils/baseType";

export default class BooleanKeyword extends Type {
  public mock() {
    return Math.random() < 0.5 ? false : true;
  }
  public validate(input: any) {
    return typeof input === "boolean";
  }
}
