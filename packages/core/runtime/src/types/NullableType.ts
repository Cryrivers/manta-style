import { Annotation, Type } from '@manta-style/core';
import UnionType from './UnionType';
import NullKeyword from './NullKeyword';
import UndefinedKeyword from './UndefinedKeyword';
import MantaStyle from '..';

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
  public deriveLiteral(annotations: Annotation[]) {
    return this.nullableType.deriveLiteral(annotations);
  }
  public validate(value: unknown): value is any {
    return (
      this.type.validate(value) ||
      MantaStyle.UndefinedKeyword.validate(value) ||
      MantaStyle.NullKeyword.validate(value)
    );
  }
  public _getUnderlyingType() {
    return this.type;
  }
}
