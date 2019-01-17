import TypeLiteral from './TypeLiteral';
import UnionType from './UnionType';
import Literal from './Literal';
import { resolveReferencedType } from '../utils/referenceTypes';
import { Annotation, Type } from '@manta-style/core';
import { throwUnsupported } from '../utils/errorReporting';

export default class KeyOfKeyword extends Type {
  private type: Type;
  constructor(type: Type) {
    super();
    this.type = type;
  }
  public getKeys(): string[] {
    const { type: maybeReferencedType } = this;
    const { type }: { type: Type } = resolveReferencedType(maybeReferencedType);
    if (type instanceof TypeLiteral) {
      return type.getKeys();
    } else {
      return throwUnsupported({
        typeName: 'KeyOfKeyword',
        message: 'Unsupported Type in "keyof" keyword',
      });
    }
  }
  public deriveLiteral() {
    const keys = this.getKeys();
    return new UnionType(keys.map((key) => new Literal(key)));
  }
  public validate(value: unknown): value is any {
    const keys = this.getKeys();
    return typeof value === 'string' && keys.includes(value);
  }
  public format(value: unknown) {
    return this.deriveLiteral().format(value);
  }
}
