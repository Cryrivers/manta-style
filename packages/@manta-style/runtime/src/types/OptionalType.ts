import { Type, Annotation, MantaStyleContext } from '../utils/baseType';

export default class OptionalType extends Type {
  private type: Type;
  constructor(type: Type) {
    super();
    this.type = type;
  }
  public async deriveLiteral(
    annotations: Annotation[],
    context: MantaStyleContext,
  ) {
    return this.type.deriveLiteral(annotations, context);
  }
}
