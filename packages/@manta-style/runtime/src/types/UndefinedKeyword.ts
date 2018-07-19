import { Type } from "../utils";

export default class UndefinedKeyword extends Type {
  public mock() {
    return undefined;
  }
  public validate(input: any) {
    return input === undefined;
  }
}
