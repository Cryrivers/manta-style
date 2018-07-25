import TypeParameter from "./TypeParameter";
import { Type } from "../utils/baseType";
import { ErrorType } from "../utils/pseudoTypes";
import BooleanKeyword from "../types/BooleanKeyword";
import LiteralType from "../types/LiteralType";

export default class TypeAliasDeclaration extends Type {
  private name: string;
  private typeParameters: TypeParameter[] = [];
  private type: Type = new ErrorType(
    `TypeAliasDeclaration "${this.name}" hasn't been initialized.`
  );
  constructor(name: string) {
    super();
    this.name = name;
  }
  public TypeParameter(name: string) {
    const newTypeParam = new TypeParameter(name);
    this.typeParameters.push(newTypeParam);
    return newTypeParam;
  }
  public argumentTypes(types: Type[]) {
    for (let i = 0; i < types.length; i++) {
      // TODO: Remove this code after `deriveLiteralType` refactoring
      const type = types[i];
      if (type instanceof BooleanKeyword) {
        this.typeParameters[i].setActualType(
          Math.random() < 0.5 ? new LiteralType(false) : new LiteralType(true)
        );
      } else {
        this.typeParameters[i].setActualType(types[i]);
      }
    }
    return this;
  }
  public setType(type: Type) {
    this.type = type;
  }
  public getType() {
    return this.type;
  }
  public mock() {
    return this.type.mock();
  }
}
