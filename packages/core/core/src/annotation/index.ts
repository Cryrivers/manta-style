import { MantaStyleAnnotation } from '@manta-style/annotation-parser';
export interface Annotation {
  parentAnnotation?: Annotation;
  annotation: string;
}

const MANTA_STYLE_ANNOTATION = `@${MantaStyleAnnotation.JsdocKey}`;

export function inheritAnnotations(
  parentAnnotation: Annotation,
  child: Annotation,
) {
  child.parentAnnotation = parentAnnotation;
}

export function extractMantaStyleJSDocContent(
  multilineComment: string,
): string {
  const jsdocIndex = multilineComment.indexOf(MANTA_STYLE_ANNOTATION);
  console.log('jsdocIndex', jsdocIndex);
  if (jsdocIndex > -1) {
    const substr = multilineComment
      .substring(jsdocIndex + MANTA_STYLE_ANNOTATION.length)
      .trimLeft();
    console.log('substr', substr);
    if (substr.startsWith('{{')) {
      const bracketEnd = substr.indexOf('}}');
      console.log('bracketEnd', bracketEnd);
      return substr.substring(0, bracketEnd + 2);
    }
  }
  return '';
}

export { MantaStyleAnnotation };
