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
  public async getKeys(context: MantaStyleContext): Promise<string[]> {
    const { type: maybeReferencedType } = this;
    const { type }: { type: Type } = await resolveReferencedType(
      maybeReferencedType,
      context,
    );
    if (type instanceof TypeLiteral) {
      return type.getKeys();
    } else {
      throw new Error('Unsupported Type in "keyof" keyword');
    }
  }
  public async deriveLiteral(
    annotations: Annotation[],
    context: MantaStyleContext,
  ) {
    const keys = await this.getKeys(context);
    return new UnionType(keys.map((key) => new Literal(key)));
  }
}
