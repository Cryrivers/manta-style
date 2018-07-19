import { Type } from "../utils";

// TODO: Implement this
// This is a big one. and I don't know how to do this..
export default class ConditionalType extends Type {
  private checkType: Type;
  private extendsType: Type;
  private trueType: Type;
  private falseType: Type;
  constructor(
    checkType: Type,
    extendsType: Type,
    trueType: Type,
    falseType: Type
  ) {
    super();
    this.checkType = checkType;
    this.extendsType = extendsType;
    this.trueType = trueType;
    this.falseType = falseType;
  }
  public mock() {
    return null;
  }
  public validate(input: any) {
    return input === null;
  }
}
