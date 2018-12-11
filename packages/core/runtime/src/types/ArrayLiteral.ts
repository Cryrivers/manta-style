import { Type } from '@manta-style/core';

export default class ArrayLiteral extends Type {
  private readonly elements: Type[];
  constructor(elements: Type[]) {
    super();
    this.elements = elements;
  }
  public getElements() {
    return this.elements;
  }
  public deriveLiteral() {
    return this;
  }
  public validate(value: unknown): value is any[] {
    return (
      Array.isArray(value) &&
      value.length === this.elements.length &&
      value.every((item, index) => this.elements[index].validate(item))
    );
  }
  public mock() {
    return this.elements.map((type) => type.mock());
  }
  public format(value: unknown) {
    if (Array.isArray(value) && value.length === this.elements.length) {
      return this.elements.map((type, index) => type.format(value[index]));
    }
    throw new Error('Cannot format as the value cannot be validated.');
  }
}
