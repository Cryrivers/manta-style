import { Annotation, Type, MantaStyleContext } from '../utils/baseType';
import ArrayLiteral from './ArrayLiteral';
import OptionalType from './OptionalType';
import RestType from './RestType';

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
}
