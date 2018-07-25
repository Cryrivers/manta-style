import { Type } from "../utils/baseType";

export default class UndefinedKeyword extends Type {
  public mock() {
    return undefined;
  }
  public validate(input: any) {
    return input === undefined;
  }
}
