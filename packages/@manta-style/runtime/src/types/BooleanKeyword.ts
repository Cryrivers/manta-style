import { Type } from "../utils";

export default class BooleanKeyword extends Type {
  public mock() {
    return Math.random() < 0.5 ? false : true;
  }
  public validate(input: any) {
    return typeof input === "boolean";
  }
}
