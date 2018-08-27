import { Type, Annotation } from '../utils/baseType';
import UnionType from './UnionType';
import { resolveReferencedType } from '../utils/referenceTypes';
import { isAssignable } from '../utils/assignable';
import { normalizeUnion } from '../utils/union';

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
  public async deriveLiteral(annotations: Annotation[]) {
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
    const { type: checkType } = await resolveReferencedType(
      maybeReferencedCheckType,
    );
    const { type: trueType } = await resolveReferencedType(
      maybeReferencedTrueType,
    );
    const { type: falseType } = await resolveReferencedType(
      maybeReferencedFalseType,
    );
    if (checkType instanceof UnionType) {
      const resolvedType = await normalizeUnion(
        new UnionType(
          await Promise.all(
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
        ),
      );
      return resolvedType.deriveLiteral(annotations);
    } else {
      const resolvedType = await resolveConditionalType(
        checkType,
        extendsType,
        trueType,
        falseType,
      );
      return resolvedType.deriveLiteral(annotations);
    }
  }
}

async function resolveConditionalType(
  checkType: Type,
  extendsType: Type,
  trueType: Type,
  falseType: Type,
): Promise<Type> {
  return (await isAssignable(checkType, extendsType)) ? trueType : falseType;
}
