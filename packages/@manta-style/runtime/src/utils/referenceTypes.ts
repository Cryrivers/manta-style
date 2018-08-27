import TypeAliasDeclaration from '../nodes/TypeAliasDeclaration';
import { Type, Annotation } from './baseType';
import TypeParameter from '../nodes/TypeParameter';
import KeyOfKeyword from '../types/KeyOfKeyword';
import ParenthesizedType from '../types/ParenthesizedType';
import { inheritAnnotations } from '../utils/annotation';

/**
 * @description
 * Get the actual type a TypeAliasDeclaration
 * or TypeParameter (generic type) refers to. It can only be used
 * in `deriveLiteral` methods.
 * @param type Type to be resolved
 */
export async function resolveReferencedType(
  type: Type,
): Promise<{ type: Type; annotations: Annotation[] }> {
  let actualType = type;
  let annotations: Annotation[] = [];
  while (
    actualType instanceof TypeAliasDeclaration ||
    actualType instanceof TypeParameter ||
    actualType instanceof ParenthesizedType ||
    actualType instanceof KeyOfKeyword
  ) {
    if (actualType instanceof TypeAliasDeclaration) {
      // Make sure type parameters has been initialized
      // as we moved the initialization from `argumentTypes`
      // to `deriveLiteral`.
      actualType.deriveLiteral(annotations);
      annotations = inheritAnnotations(
        annotations,
        actualType.getAnnotations(),
      );
      actualType = actualType.getType();
    } else if (actualType instanceof TypeParameter) {
      actualType = actualType.getActualType();
    } else if (actualType instanceof KeyOfKeyword) {
      actualType = await actualType.deriveLiteral();
    } else {
      actualType = actualType.getType();
    }
  }
  return { type: actualType, annotations };
}
