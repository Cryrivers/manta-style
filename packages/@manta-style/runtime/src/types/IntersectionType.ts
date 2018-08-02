import { Type } from '../utils/baseType';
import { resolveReferencedType } from '../utils/referenceTypes';
import { intersection } from '../utils/intersection';

export default class IntersectionType extends Type {
  private types: Type[];
  constructor(types: Type[]) {
    super();
    this.types = types;
  }
  public deriveLiteral() {
    const reducedType = this.types
      .map(resolveReferencedType)
      .reduce((previousType, currentType) =>
        intersection(previousType, currentType),
      );
    return reducedType.deriveLiteral();
  }
  public getTypes() {
    return this.types;
  }
}
