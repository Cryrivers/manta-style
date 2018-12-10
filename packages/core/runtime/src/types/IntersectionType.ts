import { resolveReferencedType } from '../utils/referenceTypes';
import { intersection } from '../utils/intersection';
import { Annotation, MantaStyleContext, Type } from '@manta-style/core';

export default class IntersectionType extends Type {
  private readonly types: Type[];
  constructor(types: Type[]) {
    super();
    this.types = types;
  }
  public deriveLiteral(
    parentAnnotations: Annotation[],
    context: MantaStyleContext,
  ) {
    const resolvedTypes = this.types.map(
      (type) => resolveReferencedType(type, context).type,
    );
    let reducedType = resolvedTypes[0];
    for (const type of resolvedTypes) {
      reducedType = intersection(reducedType, type, context);
    }
    return reducedType.deriveLiteral(parentAnnotations, context);
  }
  public validate(value: unknown, context: MantaStyleContext): value is any {
    return this.types.every((type) => type.validate(value, context));
  }
  public getTypes() {
    return this.types;
  }
}
