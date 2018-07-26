import { Type, Annotation } from '../utils/baseType';
import UnionType from './UnionType';
import { resolveReferencedType } from '../utils/referenceTypes';
import { isAssignable } from '../utils/assignable';

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
    this.checkType = resolveReferencedType(checkType);
    this.extendsType = resolveReferencedType(extendsType);
    this.trueType = resolveReferencedType(trueType);
    this.falseType = resolveReferencedType(falseType);
  }
  public deriveLiteral(annotations?: Annotation[]) {
    /*
      From: http://koerbitz.me/posts/a-look-at-typescripts-conditional-types.html
      The Distributive Rule of Conditional and Union Types
      One interesting rule about conditional types is how they interact with union types. 
      A conditional types distributes over a union type with the following distribution law:
      (A | B) extends T ? X : U = (A extends T ? X : U) | (B extends T ? X : U)
    */
    const { checkType, extendsType, trueType, falseType } = this;
    if (checkType instanceof UnionType) {
      const resolvedType = new UnionType(
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
      );
      return resolvedType.deriveLiteral();
    } else {
      const resolvedType = resolveConditionalType(
        checkType,
        extendsType,
        trueType,
        falseType,
      );
      return resolvedType.deriveLiteral(annotations);
    }
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
