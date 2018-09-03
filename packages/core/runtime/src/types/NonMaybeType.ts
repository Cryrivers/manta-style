import { Annotation, MantaStyleContext, Type } from '@manta-style/core';
import UnionType from './UnionType';
import NullKeyword from './NullKeyword';
import UndefinedKeyword from './UndefinedKeyword';
import NullableType from './NullableType';
import TypeAliasDeclaration from '../nodes/TypeAliasDeclaration';
import NeverKeyword from './NeverKeyword';

export default class NonMaybeType extends Type {
  private type: Type;
  private initiated: boolean;

  constructor(type: Type) {
    super();
    this.initiated = false;
    this.type = type;
  }
  public async deriveLiteral(
    annotations: Annotation[],
    context: MantaStyleContext,
  ) {
    if (!this.initiated) {
      this.initiated = true;
      if (this.type instanceof TypeAliasDeclaration) {
        this.type = this.type.getType();
      }

      if (this.type instanceof UnionType) {
        // remove null and undefined from UnionType
        this.type = new UnionType(
          this.type.getTypes().filter((t) => !isNullOrUndefined(t)),
        );
      } else if (this.type instanceof NullableType) {
        // reverse nullale
        this.type = this.type._getUnderlyingType();
      } else if (isNullOrUndefined(this.type)) {
        this.type = new NeverKeyword();
      }
    }
    return this.type.deriveLiteral(annotations, context);
  }
}

function isNullOrUndefined(t: Type) {
  return t instanceof NullKeyword || t instanceof UndefinedKeyword;
}
