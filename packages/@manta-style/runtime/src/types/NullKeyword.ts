import { Type } from "../utils";

export default class NullKeyword extends Type {
  public mock() {
    return null;
  }
  public validate(input: any) {
    return input === null;
  }
}
