import TypeParameter from "./TypeParameter";
import { Type, ErrorType } from "../utils";

export default class TypeAliasDeclaration extends Type {
  private name: string;
  private typeParameters: TypeParameter[] = [];
  private type: Type = new ErrorType(`TypeAliasDeclaration "${this.name}" hasn't been initialized.`);
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
    console.assert(types.length === this.typeParameters.length);
    for (let i = 0; i < types.length; i++) {
      this.typeParameters[i].setActualType(types[i]);
    }
    return this;
  }
  public setType(type: Type) {
    this.type = type;
  }
  public mock() {
    return this.type.mock();
  }
  public validate(input: any) {
    return this.type.validate(input);
  }
}
