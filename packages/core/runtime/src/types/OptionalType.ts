import { Annotation, MantaStyleContext, Type } from '@manta-style/core';
import MantaStyle from '..';

export default class OptionalType extends Type {
  private type: Type;
  constructor(type: Type) {
    super();
    this.type = type;
  }
  public deriveLiteral(annotations: Annotation[], context: MantaStyleContext) {
    return this.type.deriveLiteral(annotations, context);
  }
  public validate(value: unknown, context: MantaStyleContext): value is any {
    return (
      this.type.validate(value, context) ||
      MantaStyle.UndefinedKeyword.validate(value)
    );
  }
}
