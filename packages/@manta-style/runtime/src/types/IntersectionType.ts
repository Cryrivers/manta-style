import { Annotation, Type, MantaStyleContext } from '../utils/baseType';
import { resolveReferencedType } from '../utils/referenceTypes';
import { intersection } from '../utils/intersection';

export default class IntersectionType extends Type {
  private readonly types: Type[];
  constructor(types: Type[]) {
    super();
    this.types = types;
  }
  public async deriveLiteral(
    parentAnnotations: Annotation[],
    context: MantaStyleContext,
  ) {
    const resolvedTypes = (await Promise.all(
      this.types.map((type) => resolveReferencedType(type, context)),
    )).map((item) => item.type);
    let reducedType = resolvedTypes[0];
    for (const type of resolvedTypes) {
      reducedType = await intersection(reducedType, type, context);
    }
    return reducedType.deriveLiteral(parentAnnotations, context);
  }
  public getTypes() {
    return this.types;
  }
}
