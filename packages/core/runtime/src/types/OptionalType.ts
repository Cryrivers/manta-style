import { Annotation, Type } from '@manta-style/core';
import MantaStyle from '..';

export default class OptionalType extends Type {
  private type: Type;
  constructor(type: Type) {
    super();
    this.type = type;
  }
  public deriveLiteral(annotations: Annotation[]) {
    return this.type.deriveLiteral(annotations);
  }
  public validate(value: unknown): value is any {
    return (
      this.type.validate(value) || MantaStyle.UndefinedKeyword.validate(value)
    );
  }
}
