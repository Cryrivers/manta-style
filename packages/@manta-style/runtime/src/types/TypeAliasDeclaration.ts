import { Type } from "../utils";

// Handle Generics Here
export default class TypeAliasDeclaration extends Type {
  public mock() {
    return true;
  }
  public validate() {
    return false;
  }
}
