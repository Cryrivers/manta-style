import ArrayLiteral from './ArrayLiteral';
import OptionalType from './OptionalType';
import RestType from './RestType';
import { Annotation, Type } from '@manta-style/core';

export default class TupleType extends Type {
  private readonly elementTypes: Type[];
  constructor(elementTypes: Type[]) {
    super();
    this.elementTypes = elementTypes;
  }
  public deriveLiteral(parentAnnotations: Annotation[]) {
    const arrayLiteral: Type[] = [];
    for (const type of this.elementTypes) {
      const chance = type instanceof OptionalType ? Math.random() : 1;
      if (chance > 0.5) {
        if (type instanceof RestType) {
          arrayLiteral.push(
            ...type.deriveLiteral(parentAnnotations).getElements(),
          );
        } else {
          arrayLiteral.push(type.deriveLiteral(parentAnnotations));
        }
      }
    }
    return new ArrayLiteral(arrayLiteral);
  }
  private looseValidate(value: unknown): value is any[] {
    // TODO: Calculate the correct length based on OptionalTypes and RestType
    return (
      Array.isArray(value) &&
      value.length >=
        this.elementTypes.filter((type) => !(type instanceof OptionalType))
          .length
    );
  }
  public validate(value: unknown): value is any[] {
    return (
      this.looseValidate(value) &&
      value.every((item, index) => this.elementTypes[index].validate(item))
    );
  }
  public format(value: unknown) {
    if (this.looseValidate(value)) {
      return value.map((item, index) => this.elementTypes[index].format(item));
    } else {
      throw new Error('Cannot format as the value cannot be validated.');
    }
  }
}
