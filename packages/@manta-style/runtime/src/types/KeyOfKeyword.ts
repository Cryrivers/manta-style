import TypeLiteral from './TypeLiteral';
import UnionType from './UnionType';
import Literal from './Literal';
import { Type } from '../utils/baseType';
import { resolveReferencedType } from '../utils/referenceTypes';

export default class KeyOfKeyword extends Type {
  private type: Type;
  constructor(type: Type) {
    super();
    this.type = type;
  }
  public async getKeys(): Promise<string[]> {
    const { type: maybeReferencedType } = this;
    const { type }: { type: Type } = await resolveReferencedType(
      maybeReferencedType,
    );
    if (type instanceof TypeLiteral) {
      return type.getKeys();
    } else {
      throw new Error('Unsupported Type in "keyof" keyword');
    }
  }
  public async deriveLiteral() {
    const keys = await this.getKeys();
    return new UnionType(keys.map((key) => new Literal(key)));
  }
}
