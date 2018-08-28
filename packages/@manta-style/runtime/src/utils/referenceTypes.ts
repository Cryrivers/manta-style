import TypeAliasDeclaration from '../nodes/TypeAliasDeclaration';
import { Type, Annotation } from './baseType';
import TypeParameter from '../nodes/TypeParameter';
import KeyOfKeyword from '../types/KeyOfKeyword';
import ParenthesizedType from '../types/ParenthesizedType';
import { inheritAnnotations } from '../utils/annotation';
import { MantaStyleContext } from '../typedef';

/**
 * @description
 * Get the actual type a TypeAliasDeclaration
 * or TypeParameter (generic type) refers to. It can only be used
 * in `deriveLiteral` methods.
 * @param type Type to be resolved
 * @param context MantaStyle Context Object
 */
export async function resolveReferencedType(
  type: Type,
  context: MantaStyleContext,
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
      await actualType.deriveLiteral(annotations, context);
      annotations = inheritAnnotations(
        annotations,
        actualType.getAnnotations(),
      );
      actualType = actualType.getType();
    } else if (actualType instanceof TypeParameter) {
      actualType = actualType.getActualType();
    } else if (actualType instanceof KeyOfKeyword) {
      actualType = await actualType.deriveLiteral(annotations, context);
    } else {
      actualType = actualType.getType();
    }
  }
  return { type: actualType, annotations };
}
