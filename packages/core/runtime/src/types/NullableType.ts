import { annotationUtils, MantaStyleContext, Type } from '@manta-style/core';
import UnionType from './UnionType';
import NullKeyword from './NullKeyword';
import UndefinedKeyword from './UndefinedKeyword';

export default class NullableType extends Type {
  private type: Type;
  private nullableType: Type;
  constructor(type: Type) {
    super();
    this.type = type;
    this.nullableType = new UnionType([
      type,
      new NullKeyword(),
      new UndefinedKeyword(),
    ]);
  }
  public async deriveLiteral(
    annotations: annotationUtils.MantaStyleAnnotation,
    context: MantaStyleContext,
  ) {
    return this.nullableType.deriveLiteral(annotations, context);
  }
  public _getUnderlyingType() {
    return this.type;
  }
}
