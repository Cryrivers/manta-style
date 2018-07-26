import TypeLiteral from "./TypeLiteral";
import UnionType from "./UnionType";
import Literal from "./Literal";
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
  public deriveLiteral() {
    return new UnionType(this.getKeys().map(key => new Literal(key)));
  }
}
