import { Type, Annotation, Property } from "../utils/baseType";
import UnionType from "./UnionType";
import AnyKeyword from "./AnyKeyword";
import LiteralType from "./LiteralType";
import NumberKeyword from "./NumberKeyword";
import StringKeyword from "./StringKeyword";
import TypeLiteral from "./TypeLiteral";
import { resolveReferencedType } from "../utils/referenceTypes";
import BooleanKeyword from "./BooleanKeyword";

function isAssignable(typeS: Type, typeT: Type): boolean {
  const S = resolveReferencedType(typeS);
  const T = resolveReferencedType(typeT);
  console.log("S:\n", S, "\nT:\n", T);
  if (Object.getPrototypeOf(S) === Object.getPrototypeOf(T)) {
    // - S and T are identical types.
    if (S instanceof LiteralType && T instanceof LiteralType) {
      // For LiteralType, we also need to compare the literal
      return S.mock() === T.mock();
    }
    return true;
  } else if (S instanceof AnyKeyword || T instanceof AnyKeyword) {
    // - S or T is the Any type.
    return true;
  } else if (
    S instanceof LiteralType &&
    typeof S.mock() === "number" &&
    T instanceof NumberKeyword
  ) {
    // - S or T is an enum type and the other is the primitive type Number
    return true;
  } else if (
    S instanceof LiteralType &&
    typeof S.mock() === "string" &&
    T instanceof StringKeyword
  ) {
    // - S is a string literal type and T is the primitive type String.
    return true;
  } else if (
    S instanceof LiteralType &&
    typeof S.mock() === "boolean" &&
    T instanceof BooleanKeyword
  ) {
    // - S is a boolean literal type and T is the primitive type Boolean.
    return true;
  } else if (S instanceof UnionType) {
    // - S is a union type and each constituent type of S is assignable to T
    return S.getTypes().every(type => isAssignable(type, T));
  } else if (false /* TODO: Implement intersection type first */) {
    // - S is an intersection type and at least one constituent type of S is assignable to T.
  } else if (T instanceof UnionType) {
    // - T is a union type and S is assignable to at least one constituent type of T
    return T.getTypes().some(type => isAssignable(S, type));
  } else if (false /* TODO: Implement intersection type first */) {
    // - T is an intersection type and S is assignable to each constituent type of T.
  } else if (S instanceof TypeLiteral && T instanceof TypeLiteral) {
    // - S is an object type, an intersection type, an enum type, or the Number, Boolean, or String
    // primitive type, T is an object type, and for each member M in T, one of the following is true:
    const SProperties = S._getProperties();
    const TProperties = T._getProperties();
    return TProperties.every(M => {
      // * M is a property and S has an apparent property N where
      //   - M and N have the same name,
      //   - the type of N is assignable to that of M,
      //   - if M is a required property, N is also a required property, and
      //   - M and N are both public, M and N are both private and originate in the same
      //   declaration, M and N are both protected and originate in the same declaration, or
      //   M is protected and N is declared in a class derived from the class in which M is
      //   declared.
      const N = SProperties.find(property => property.name === M.name);
      if (
        N &&
        isAssignable(N.type, M.type) &&
        !M.questionMark &&
        !N.questionMark
      ) {
        return true;
      }
      // * M is an optional property and S has no apparent property of the same name as M.
      if (M.questionMark && !N) {
        return true;
      }
      // TODO:
      // * M is a string index signature of type U, and U is the Any type or S has an apparent string
      // index signature of a type that is assignable to U.
      // * M is a numeric index signature of type U, and U is the Any type or S has an apparent
      // string or numeric index signature of a type that is assignable to U.
      return false;
    });
  }
  return false;
}

export default class ConditionalType extends Type {
  private checkType: Type;
  private extendsType: Type;
  private trueType: Type;
  private falseType: Type;
  constructor(
    checkType: Type,
    extendsType: Type,
    trueType: Type,
    falseType: Type
  ) {
    super();
    this.checkType = checkType;
    this.extendsType = extendsType;
    this.trueType = trueType;
    this.falseType = falseType;
  }
  public mock(annotations?: Annotation[]) {
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
      trueType,
      falseType
    } = this;

    const checkType = resolveReferencedType(maybeReferencedCheckType);
    if (checkType instanceof UnionType) {
      console.log("union type");
      const resolvedType = new UnionType(
        checkType
          .getTypes()
          .map(type =>
            resolveConditionalType(
              type,
              extendsType,
              checkType === trueType ? type : trueType,
              checkType === falseType ? type : falseType
            )
          )
      );
      console.log("resolved type");
      console.log(resolvedType);
      return resolvedType.mock();
    } else {
      console.log("non-union type");
      const resolvedType = resolveConditionalType(
        checkType,
        extendsType,
        trueType,
        falseType
      );
      return resolvedType.mock(annotations);
    }
  }
}

function resolveConditionalType(
  checkType: Type,
  extendsType: Type,
  trueType: Type,
  falseType: Type
): Type {
  return isAssignable(checkType, extendsType) ? trueType : falseType;
}
