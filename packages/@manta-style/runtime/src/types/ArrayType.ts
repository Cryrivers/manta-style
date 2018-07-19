import { Type } from "../utils";

export default class ArrayType extends Type {
  private elementType: Type;
  constructor(elementType: Type) {
    super();
    this.elementType = elementType;
  }
  public mock() {
    const array = [];
    const randomLength = Math.floor(Math.random() * 5) + 1;
    for (let i = 0; i < randomLength; i++) {
      array.push(this.elementType.mock());
    }
    return array;
  }
  public validate(input: any) {
    return (
      Array.isArray(input) &&
      input.every(item => this.elementType.validate(item))
    );
  }
}
