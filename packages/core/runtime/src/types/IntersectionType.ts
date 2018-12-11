import { resolveReferencedType } from '../utils/referenceTypes';
import { intersection } from '../utils/intersection';
import { Annotation, Type } from '@manta-style/core';

export default class IntersectionType extends Type {
  private readonly types: Type[];
  constructor(types: Type[]) {
    super();
    this.types = types;
  }
  private getReducedType() {
    return this.types
      .map((type) => resolveReferencedType(type).type)
      .reduce((prev, current) => intersection(prev, current));
  }
  public deriveLiteral(parentAnnotations: Annotation[]) {
    return this.getReducedType().deriveLiteral(parentAnnotations);
  }
  public format(value: unknown) {
    return this.getReducedType().format(value);
  }
  public validate(value: unknown): value is any {
    return this.types.every((type) => type.validate(value));
  }
  public getTypes() {
    return this.types;
  }
}
