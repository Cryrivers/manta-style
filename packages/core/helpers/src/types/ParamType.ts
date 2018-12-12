import MantaStyle, {
  LiteralType,
  resolveReferencedType,
} from '@manta-style/runtime';
import { Annotation, Type, CustomType, useParam } from '@manta-style/core';

export default class ParamType extends CustomType {
  private readonly type: Type;
  constructor(type: Type) {
    super();
    this.type = type;
  }
  public typeForAssignabilityTest(annotations: Annotation[]) {
    return this.deriveLiteral();
  }
  public getParamContent() {
    const [param] = useParam();
    const { type } = resolveReferencedType(this.type);
    if (type instanceof LiteralType && typeof param === 'object') {
      return param[type.mock()];
    }
  }
  public deriveLiteral() {
    const content = this.getParamContent();
    if (content) {
      if (typeof content === 'string') {
        return MantaStyle.Literal(content);
      } else if (Array.isArray(content)) {
        return MantaStyle.ArrayLiteral(
          content.map((item) => MantaStyle.Literal(item)),
        );
      }
    }
    return MantaStyle.NeverKeyword;
  }
  public validate(value: unknown): value is any {
    const content = this.getParamContent();
    return value === content;
  }
  public format(value: unknown) {
    const content = this.getParamContent();
    if (value == content) {
      return content;
    } else {
      throw new Error('Cannot format as the value cannot be validated.');
    }
  }
}
