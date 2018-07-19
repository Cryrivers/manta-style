import { Type } from "../utils";

export default class StringKeyword extends Type {
  public mock() {
    return "I'm too lazy to implement this";
  }
  public validate(input: any) {
    return typeof input === "string";
  }
}
