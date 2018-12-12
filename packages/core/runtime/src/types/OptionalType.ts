import { Annotation, Type } from '@manta-style/core';
import MantaStyle from '..';
import UnionType from './UnionType';

export default class OptionalType extends Type {
  private type: Type;
  private optionalType: UnionType;
  constructor(type: Type) {
    super();
    this.type = type;
    this.optionalType = new UnionType([this.type, MantaStyle.UndefinedKeyword]);
  }
  public deriveLiteral(annotations: Annotation[]) {
    return this.type.deriveLiteral(annotations);
  }
  public validate(value: unknown): value is any {
    return this.optionalType.validate(value);
  }
  public format(value: unknown) {
    return this.optionalType.format(value);
  }
}
