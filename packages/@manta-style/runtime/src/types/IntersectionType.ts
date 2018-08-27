import { Annotation, Type } from '../utils/baseType';
import { resolveReferencedType } from '../utils/referenceTypes';
import { intersection } from '../utils/intersection';

export default class IntersectionType extends Type {
  private readonly types: Type[];
  constructor(types: Type[]) {
    super();
    this.types = types;
  }
  public async deriveLiteral(parentAnnotations: Annotation[]) {
    const resolvedTypes = (await Promise.all(
      this.types.map(resolveReferencedType),
    )).map((item) => item.type);
    let reducedType = resolvedTypes[0];
    for(const type of resolvedTypes) {
      reducedType = await intersection(reducedType, type);
    }
    return reducedType.deriveLiteral(parentAnnotations);
  }
  public getTypes() {
    return this.types;
  }
}
