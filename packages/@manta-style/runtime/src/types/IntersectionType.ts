import { Annotation, Type } from '../utils/baseType';
import { resolveReferencedType } from '../utils/referenceTypes';
import { intersection } from '../utils/intersection';

export default class IntersectionType extends Type {
  private readonly types: Type[];
  constructor(types: Type[]) {
    super();
    this.types = types;
  }
  public deriveLiteral(parentAnnotations: Annotation[]) {
    const reducedType = this.types
      .map(resolveReferencedType)
      .reduce((previousType, currentType) =>
        intersection(previousType, currentType),
      );
    return reducedType.deriveLiteral(parentAnnotations);
  }
  public getTypes() {
    return this.types;
  }
}
