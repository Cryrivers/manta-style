import { Type, MantaStyleContext } from '@manta-style/core';
import { everyPromise } from '../utils/assignable';

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
  public async validate(value: unknown, context: MantaStyleContext) {
    return (
      Array.isArray(value) &&
      value.length === this.elements.length &&
      (await everyPromise(
        value.map((item, index) =>
          this.elements[index].validate(item, context),
        ),
      ))
    );
  }
  public mock() {
    return this.elements.map((type) => type.mock());
  }
}
