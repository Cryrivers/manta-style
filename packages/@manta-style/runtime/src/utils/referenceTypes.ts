import TypeReference from '../types/TypeReference';
import TypeAliasDeclaration from '../nodes/TypeAliasDeclaration';
import { Type, Annotation } from './baseType';
import TypeParameter from '../nodes/TypeParameter';
import KeyOfKeyword from '../types/KeyOfKeyword';
import ParenthesizedType from '../types/ParenthesizedType';
import { inheritAnnotations } from '../utils/annotation';
import LazyTypeAliasDeclaration from '../nodes/LazyTypeAliasDeclaration';

/**
 * @description
 * Get the actual type a TypeReference, TypeAliasDeclaration
 * or TypeParameter (generic type) refers to. It can only be used
 * in `deriveLiteral` methods.
 * @param type Type to be resolved
 */
export function resolveReferencedType(
  type: Type,
): { type: Type; annotations: Annotation[] } {
  let actualType = type;
  let annotations: Annotation[] = [];
  while (
    actualType instanceof TypeReference ||
    actualType instanceof TypeAliasDeclaration ||
    actualType instanceof TypeParameter ||
    actualType instanceof ParenthesizedType ||
    actualType instanceof KeyOfKeyword ||
    actualType instanceof LazyTypeAliasDeclaration
  ) {
    if (actualType instanceof LazyTypeAliasDeclaration) {
      actualType = actualType.initialize();
    } else if (actualType instanceof TypeReference) {
      actualType = actualType.getActualType();
    } else if (actualType instanceof TypeAliasDeclaration) {
      actualType.deriveLiteral(annotations);
      annotations = inheritAnnotations(
        annotations,
        actualType.getAnnotations(),
      );
      actualType = actualType.getType();
    } else if (actualType instanceof TypeParameter) {
      actualType = actualType.getActualType();
    } else if (actualType instanceof KeyOfKeyword) {
      actualType = actualType.deriveLiteral();
    } else {
      actualType = actualType.getType();
    }
  }
  return { type: actualType, annotations };
}
