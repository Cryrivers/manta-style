import { Type } from "../utils";

export default class NumberKeyword extends Type {
  public mock() {
    return Math.random() * 100;
  }
  public validate(input: any) {
    return typeof input === "number";
  }
}
