import TypeReference from '../types/TypeReference';
import TypeAliasDeclaration from '../nodes/TypeAliasDeclaration';
import { Type } from './baseType';
import TypeParameter from '../nodes/TypeParameter';

export function resolveReferencedType(type: Type): Type {
  let actualType = type;
  while (
    actualType instanceof TypeReference ||
    actualType instanceof TypeAliasDeclaration ||
    actualType instanceof TypeParameter
  ) {
    if (actualType instanceof TypeReference) {
      actualType = actualType.getActualType();
    } else if (actualType instanceof TypeAliasDeclaration) {
      actualType = actualType.getType();
    } else if (actualType instanceof TypeParameter) {
      actualType = actualType.getActualType();
    } else {
      throw new Error('Something bad happens :(');
    }
  }
  return actualType;
}
