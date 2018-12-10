import TypeLiteral from './TypeLiteral';
import UnionType from './UnionType';
import Literal from './Literal';
import { resolveReferencedType } from '../utils/referenceTypes';
import { Annotation, MantaStyleContext, Type } from '@manta-style/core';

export default class KeyOfKeyword extends Type {
  private type: Type;
  constructor(type: Type) {
    super();
    this.type = type;
  }
  public getKeys(context: MantaStyleContext): string[] {
    const { type: maybeReferencedType } = this;
    const { type }: { type: Type } = resolveReferencedType(
      maybeReferencedType,
      context,
    );
    if (type instanceof TypeLiteral) {
      return type.getKeys();
    } else {
      throw new Error('Unsupported Type in "keyof" keyword');
    }
  }
  public deriveLiteral(annotations: Annotation[], context: MantaStyleContext) {
    const keys = this.getKeys(context);
    return new UnionType(keys.map((key) => new Literal(key)));
  }
  public validate(value: unknown, context: MantaStyleContext): value is any {
    const keys = this.getKeys(context);
    return typeof value === 'string' && keys.includes(value);
  }
}
