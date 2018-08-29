import { Type } from '../utils/baseType';
import { Annotation, MantaStyleContext } from '@manta-style/core';

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
