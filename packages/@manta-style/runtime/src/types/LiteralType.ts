import { Literals, Type } from "../utils/baseType";

export default class LiteralType<T extends Literals> extends Type {
  private literal: T;
  constructor(literal: T) {
    super();
    this.literal = literal;
  }
  public mock() {
    return this.literal;
  }
  public validate(input: any) {
    return input === this.literal;
  }
}
