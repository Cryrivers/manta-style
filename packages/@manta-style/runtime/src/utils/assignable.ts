import { Type } from './baseType';
import { resolveReferencedType } from './referenceTypes';
import Literal from '../types/Literal';
import AnyKeyword from '../types/AnyKeyword';
import NumberKeyword from '../types/NumberKeyword';
import StringKeyword from '../types/StringKeyword';
import BooleanKeyword from '../types/BooleanKeyword';
import UnionType from '../types/UnionType';
import TypeLiteral from '../types/TypeLiteral';
import IntersectionType from '../types/IntersectionType';
import { MantaStyleContext } from '../typedef';

export async function isAssignable(
  typeS: Type,
  typeT: Type,
  context: MantaStyleContext,
): Promise<boolean> {
  const { type: S } = await resolveReferencedType(typeS, context);
  const { type: T } = await resolveReferencedType(typeT, context);

  if (Object.getPrototypeOf(S) === Object.getPrototypeOf(T)) {
    // - S and T are identical types.
    if (S instanceof Literal && T instanceof Literal) {
      // For LiteralType, we also need to compare the literal
      return S.mock() === T.mock();
    }
    return true;
  } else if (S instanceof AnyKeyword || T instanceof AnyKeyword) {
    // - S or T is the Any type.
    return true;
  } else if (
    S instanceof Literal &&
    typeof S.mock() === 'number' &&
    T instanceof NumberKeyword
  ) {
    // - S or T is an enum type and the other is the primitive type Number
    return true;
  } else if (
    S instanceof Literal &&
    typeof S.mock() === 'string' &&
    T instanceof StringKeyword
  ) {
    // - S is a string literal type and T is the primitive type String.
    return true;
  } else if (
    S instanceof Literal &&
    typeof S.mock() === 'boolean' &&
    T instanceof BooleanKeyword
  ) {
    // - S is a boolean literal type and T is the primitive type Boolean.
    return true;
  } else if (S instanceof UnionType) {
    // - S is a union type and each constituent type of S is assignable to T
    return everyPromise(
      S.getTypes().map((type) => isAssignable(type, T, context)),
    );
  } else if (S instanceof IntersectionType) {
    // - S is an intersection type and at least one constituent type of S is assignable to T.
    return somePromise(
      S.getTypes().map((type) => isAssignable(type, T, context)),
    );
  } else if (T instanceof UnionType) {
    // - T is a union type and S is assignable to at least one constituent type of T
    return somePromise(
      T.getTypes().map((type) => isAssignable(S, type, context)),
    );
  } else if (T instanceof IntersectionType) {
    // - T is an intersection type and S is assignable to each constituent type of T.
    return everyPromise(
      T.getTypes().map((type) => isAssignable(S, type, context)),
    );
  } else if (S instanceof TypeLiteral && T instanceof TypeLiteral) {
    // - S is an object type, an intersection type, an enum type, or the Number, Boolean, or String
    // primitive type, T is an object type, and for each member M in T, one of the following is true:
    const SProperties = S._getProperties();
    const TProperties = T._getProperties();
    return everyPromise(
      TProperties.map(async (M) => {
        // * M is a property and S has an apparent property N where
        //   - M and N have the same name,
        //   - the type of N is assignable to that of M,
        //   - if M is a required property, N is also a required property, and
        //   - M and N are both public, M and N are both private and originate in the same
        //   declaration, M and N are both protected and originate in the same declaration, or
        //   M is protected and N is declared in a class derived from the class in which M is
        //   declared.
        const N = SProperties.find((property) => property.name === M.name);
        if (
          N &&
          (await isAssignable(N.type, M.type, context)) &&
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
      }),
    );
  }
  return false;
}

async function everyPromise(array: Promise<boolean>[]): Promise<boolean> {
  return (await Promise.all(array)).every((t) => t);
}

async function somePromise(array: Promise<boolean>[]): Promise<boolean> {
  return (await Promise.all(array)).some((t) => t);
}
