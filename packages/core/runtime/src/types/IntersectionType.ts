import { resolveReferencedType } from '../utils/referenceTypes';
import { intersection } from '../utils/intersection';
import { Annotation, Type } from '@manta-style/core';

export default class IntersectionType extends Type {
  private readonly types: Type[];
  constructor(types: Type[]) {
    super();
    this.types = types;
  }
  public deriveLiteral(parentAnnotations: Annotation[]) {
    const resolvedTypes = this.types.map(
      (type) => resolveReferencedType(type).type,
    );
    let reducedType = resolvedTypes[0];
    for (const type of resolvedTypes) {
      reducedType = intersection(reducedType, type);
    }
    return reducedType.deriveLiteral(parentAnnotations);
  }
  public validate(value: unknown): value is any {
    return this.types.every((type) => type.validate(value));
  }
  public getTypes() {
    return this.types;
  }
}
