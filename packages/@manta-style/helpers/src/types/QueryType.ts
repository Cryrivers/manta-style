import MantaStyle, {
  Type,
  LiteralType,
  resolveReferencedType,
} from '@manta-style/runtime';
import { Annotation, MantaStyleContext } from '@manta-style/core';

export default class QueryType extends Type {
  private readonly type: Type;
  constructor(type: Type) {
    super();
    this.type = type;
  }
  public async deriveLiteral(
    annotations: Annotation[],
    context: MantaStyleContext,
  ) {
    const { query } = context;
    const { type } = await resolveReferencedType(this.type, context);
    if (type instanceof LiteralType && typeof query === 'object') {
      const content = query[type.mock()];
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
