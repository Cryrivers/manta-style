import { Type, Annotation } from '../utils/baseType';

export default class OptionalType extends Type {
  private type: Type;
  constructor(type: Type) {
    super();
    this.type = type;
  }
  public async deriveLiteral(annotations: Annotation[]) {
    return this.type.deriveLiteral(annotations);
  }
}
