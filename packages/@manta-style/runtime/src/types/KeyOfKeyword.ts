import { Type } from "../utils";
import TypeReference from "./TypeReference";
import TypeLiteral from "./TypeLiteral";
import UnionType from "./UnionType";
import LiteralType from "./LiteralType";

export default class KeyOfKeyword extends Type {
  private type: Type;
  constructor(type: Type) {
    super();
    this.type = type;
  }
  public getKeys(): string[] {
    const { type } = this;
    const actualType =
      type instanceof TypeReference ? type.getActualType().getType() : type;
    if (actualType instanceof TypeLiteral) {
      return actualType.getKeys();
    } else {
      throw new Error('Unsupported Type in "keyof" keyword');
    }
  }
  public mock() {
    return new UnionType(this.getKeys().map(key => new LiteralType(key)));
  }
  public validate(input: any) {
    return this.getKeys().includes(input);
  }
}
