import MantaStyle, {
  LiteralType,
  resolveReferencedType,
} from '@manta-style/runtime';
import { Annotation, Type, CustomType, useQuery } from '@manta-style/core';

export default class QueryType extends CustomType {
  private readonly type: Type;
  constructor(type: Type) {
    super();
    this.type = type;
  }
  public typeForAssignabilityTest() {
    return this.deriveLiteral();
  }
  public async getQueryContent() {
    const [query] = useQuery();
    const { type } = await resolveReferencedType(this.type);
    if (type instanceof LiteralType && typeof query === 'object') {
      return query[type.mock()];
    }
  }
  public deriveLiteral() {
    const content = this.getQueryContent();
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
    const content = this.getQueryContent();
    return value === content;
  }
  public format(value: unknown) {
    const content = this.getQueryContent();
    if (value == content) {
      return content;
    } else {
      throw new Error('Cannot format as the value cannot be validated.');
    }
  }
}
