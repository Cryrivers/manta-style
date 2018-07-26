import { Type } from '../utils/baseType';

export default class ArrayLiteral extends Type {
  private elements: Type[];
  constructor(elements: Type[]) {
    super();
    this.elements = elements;
  }
  public deriveLiteral() {
    return this;
  }
  public mock() {
    return this.elements.map((type) => type.mock());
  }
}
