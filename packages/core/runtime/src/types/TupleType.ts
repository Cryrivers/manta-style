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
  public validate(value: unknown): value is any {
    // TODO: Calculate the correct length based on OptionalTypes and RestType
    return (
      Array.isArray(value) &&
      value.length >=
        this.elementTypes.filter((type) => !(type instanceof OptionalType))
          .length &&
      value.every((item, index) => this.elementTypes[index].validate(item))
    );
  }
}
