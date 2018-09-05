export interface Annotation {
  parentAnnotation?: Annotation;
  annotation: string;
}

const MANTA_STYLE_JSDOC_REGEX = /@manta-style ({{([^}]+)}})/;

export function inheritAnnotations(
  parentAnnotation: Annotation,
  child: Annotation,
) {
  child.parentAnnotation = parentAnnotation;
}

export function extractMantaStyleJSDocContent(
  multilineComment: string,
): Annotation | null {
  const match = multilineComment.match(MANTA_STYLE_JSDOC_REGEX);
  if (match) {
    return {
      annotation: match[1],
    };
  }
  return null;
}
