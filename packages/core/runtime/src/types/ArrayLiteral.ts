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
  // TODO: Fix type guard
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
}
