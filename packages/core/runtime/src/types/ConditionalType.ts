import UnionType from './UnionType';
import { resolveReferencedType } from '../utils/referenceTypes';
import { isAssignable } from '../utils/assignable';
import { normalizeUnion } from '../utils/union';
import { Annotation, Type } from '@manta-style/core';

export default class ConditionalType extends Type {
  private checkType: Type;
  private extendsType: Type;
  private trueType: Type;
  private falseType: Type;
  constructor(
    checkType: Type,
    extendsType: Type,
    trueType: Type,
    falseType: Type,
  ) {
    super();
    this.checkType = checkType;
    this.extendsType = extendsType;
    this.trueType = trueType;
    this.falseType = falseType;
  }
  private getResolvedType() {
    /*
      From: http://koerbitz.me/posts/a-look-at-typescripts-conditional-types.html
      The Distributive Rule of Conditional and Union Types
      One interesting rule about conditional types is how they interact with union types. 
      A conditional types distributes over a union type with the following distribution law:
      (A | B) extends T ? X : U = (A extends T ? X : U) | (B extends T ? X : U)
    */
    const {
      checkType: maybeReferencedCheckType,
      extendsType,
      trueType: maybeReferencedTrueType,
      falseType: maybeReferencedFalseType,
    } = this;
    const [{ type: checkType }, { type: trueType }, { type: falseType }] = [
      resolveReferencedType(maybeReferencedCheckType),
      resolveReferencedType(maybeReferencedTrueType),
      resolveReferencedType(maybeReferencedFalseType),
    ];
    if (checkType instanceof UnionType) {
      const resolvedType = normalizeUnion(
        new UnionType(
          checkType
            .getTypes()
            .map((type) =>
              resolveConditionalType(
                type,
                extendsType,
                checkType === trueType ? type : trueType,
                checkType === falseType ? type : falseType,
              ),
            ),
        ),
      );
      return resolvedType;
    } else {
      const resolvedType = resolveConditionalType(
        checkType,
        extendsType,
        trueType,
        falseType,
      );
      return resolvedType;
    }
  }
  public deriveLiteral(annotations: Annotation[]) {
    const resolvedType = this.getResolvedType();
    return resolvedType.deriveLiteral(annotations);
  }
  public validate(value: unknown): value is any {
    const resolvedType = this.getResolvedType();
    return resolvedType.validate(value);
  }
}

function resolveConditionalType(
  checkType: Type,
  extendsType: Type,
  trueType: Type,
  falseType: Type,
): Type {
  return isAssignable(checkType, extendsType) ? trueType : falseType;
}
