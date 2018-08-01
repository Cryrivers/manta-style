import TypeReference from '../types/TypeReference';
import TypeAliasDeclaration from '../nodes/TypeAliasDeclaration';
import { Type } from './baseType';
import TypeParameter from '../nodes/TypeParameter';
import KeyOfKeyword from '../types/KeyOfKeyword';

/**
 * @description
 * Get the actual type a TypeReference, TypeAliasDeclaration
 * or TypeParameter (generic type) refers to. It can only be used
 * in `deriveLiteral` methods.
 * @param type Type to be resolved
 */
export function resolveReferencedType(type: Type): Type {
  let actualType = type;
  while (
    actualType instanceof TypeReference ||
    actualType instanceof TypeAliasDeclaration ||
    actualType instanceof TypeParameter ||
    actualType instanceof KeyOfKeyword
  ) {
    if (actualType instanceof TypeReference) {
      actualType = actualType.getActualType();
    } else if (actualType instanceof TypeAliasDeclaration) {
      actualType = actualType.getType();
    } else if (actualType instanceof TypeParameter) {
      actualType = actualType.getActualType();
    } else if (actualType instanceof KeyOfKeyword) {
      actualType = actualType.deriveLiteral();
    } else {
      throw new Error('Something bad happens :(');
    }
  }
  return actualType;
}
