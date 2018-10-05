import MantaStyle, {
  LiteralType,
  resolveReferencedType,
} from '@manta-style/runtime';
import {
  Annotation,
  MantaStyleContext,
  Type,
  CustomType,
} from '@manta-style/core';

export default class ParamType extends CustomType {
  private readonly type: Type;
  constructor(type: Type) {
    super();
    this.type = type;
  }
  public typeForAssignabilityTest(
    annotations: Annotation[],
    context: MantaStyleContext,
  ) {
    return this.deriveLiteral(annotations, context);
  }
  public async deriveLiteral(
    annotations: Annotation[],
    context: MantaStyleContext,
  ) {
    const { param } = context;
    const { type } = await resolveReferencedType(this.type, context);
    if (type instanceof LiteralType && typeof param === 'object') {
      const content = param[type.mock()];
      if (content) {
        if (typeof content === 'string') {
          return MantaStyle.Literal(content);
        } else if (Array.isArray(content)) {
          return MantaStyle.ArrayLiteral(
            content.map((item) => MantaStyle.Literal(item)),
          );
        }
      }
    }
    return MantaStyle.NeverKeyword;
  }
}
