import { Type } from "../utils/baseType";

export default class NeverKeyword extends Type {
  public neverType: boolean = true;
  public mock() {
    throw new Error("'mock()' for never type should be never called");
  }
  public validate(): never {
    throw new Error("'validate()' for never type should be never called");
  }
}
