import { Type, Annotation } from '../utils/baseType';

export default class ParenthesizedType extends Type {
  private readonly type: Type;
  constructor(type: Type) {
    super();
    this.type = type;
  }
  public getType() {
    return this.type;
  }
  public async deriveLiteral(annotations: Annotation[]) {
    return this.type.deriveLiteral(annotations);
  }
}
