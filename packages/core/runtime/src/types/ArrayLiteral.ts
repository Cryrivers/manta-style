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
  public async deriveLiteral() {
    return this;
  }
  public async validate(value: unknown) {
    return (
      Array.isArray(value) &&
      value.every((item, index) => item === this.elements[index])
    );
  }
  public mock() {
    return this.elements.map((type) => type.mock());
  }
}
