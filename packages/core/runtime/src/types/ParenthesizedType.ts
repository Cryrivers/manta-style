import { Annotation, Type } from '@manta-style/core';

export default class ParenthesizedType extends Type {
  private readonly type: Type;
  constructor(type: Type) {
    super();
    this.type = type;
  }
  public getType() {
    return this.type;
  }
  public deriveLiteral(annotations: Annotation[]) {
    return this.type.deriveLiteral(annotations);
  }
  public validate(value: unknown): value is any {
    return this.type.validate(value);
  }
}
