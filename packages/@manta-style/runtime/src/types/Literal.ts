import { Literals, Type } from "../utils/baseType";

export default class Literal<T extends Literals> extends Type {
  private literal: T;
  constructor(literal: T) {
    super();
    this.literal = literal;
  }
  public deriveLiteral() {
    return this;
  }
  public mock() {
    return this.literal;
  }
}
