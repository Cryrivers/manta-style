import { Type } from '../utils/baseType';
import { Annotation, MantaStyleContext } from '@manta-style/core';

export default class ParenthesizedType extends Type {
  private readonly type: Type;
  constructor(type: Type) {
    super();
    this.type = type;
  }
  public getType() {
    return this.type;
  }
  public async deriveLiteral(
    annotations: Annotation[],
    context: MantaStyleContext,
  ) {
    return this.type.deriveLiteral(annotations, context);
  }
}
