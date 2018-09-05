import { MantaStyleAnnotation } from '@manta-style/annotation-parser';
export interface Annotation {
  parentAnnotation?: Annotation;
  annotation: string;
}

const MANTA_STYLE_JSDOC_REGEX = /@mantastyle ({{([^}]+)}})/;

export function inheritAnnotations(
  parentAnnotation: Annotation,
  child: Annotation,
) {
  child.parentAnnotation = parentAnnotation;
}

export function extractMantaStyleJSDocContent(
  multilineComment: string,
): string {
  const match = multilineComment.match(MANTA_STYLE_JSDOC_REGEX);
  return match ? match[1] : '';
}

export function parseMantaStyleAnnotation(annotation: string) {
  return MantaStyleAnnotation.parseFromString(annotation);
}
