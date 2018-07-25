import TypeReference from "./TypeReference";
import TypeLiteral from "./TypeLiteral";
import UnionType from "./UnionType";
import LiteralType from "./LiteralType";
import { Type } from "../utils/baseType";

export default class KeyOfKeyword extends Type {
  private type: Type;
  constructor(type: Type) {
    super();
    this.type = type;
  }
  public getKeys(): string[] {
    const { type } = this;
    if (type instanceof TypeLiteral) {
      return type.getKeys();
    } else {
      throw new Error('Unsupported Type in "keyof" keyword');
    }
  }
  public deriveLiteralType() {
    return new UnionType(this.getKeys().map(key => new LiteralType(key)));
  }
}
