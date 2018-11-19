import ArrayLiteral from './ArrayLiteral';
import OptionalType from './OptionalType';
import RestType from './RestType';
import { Annotation, MantaStyleContext, Type } from '@manta-style/core';
import { everyPromise } from '../utils/assignable';

export default class TupleType extends Type {
  private readonly elementTypes: Type[];
  constructor(elementTypes: Type[]) {
    super();
    this.elementTypes = elementTypes;
  }
  public async deriveLiteral(
    parentAnnotations: Annotation[],
    context: MantaStyleContext,
  ) {
    const arrayLiteral: Type[] = [];
    for (const type of this.elementTypes) {
      const chance = type instanceof OptionalType ? Math.random() : 1;
      if (chance > 0.5) {
        if (type instanceof RestType) {
          arrayLiteral.push(
            ...(await type.deriveLiteral(
              parentAnnotations,
              context,
            )).getElements(),
          );
        } else {
          arrayLiteral.push(
            await type.deriveLiteral(parentAnnotations, context),
          );
        }
      }
    }
    return new ArrayLiteral(arrayLiteral);
  }
  public async validate(value: unknown, context: MantaStyleContext) {
    // TODO: Calculate the correct length based on OptionalTypes and RestType
    return (
      Array.isArray(value) &&
      value.length >=
        this.elementTypes.filter((type) => !(type instanceof OptionalType))
          .length &&
      (await everyPromise(
        value.map((item, index) =>
          this.elementTypes[index].validate(item, context),
        ),
      ))
    );
  }
}
