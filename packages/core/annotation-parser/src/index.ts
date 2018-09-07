import { AnnotationAst, parseAnnotationFromString } from './parser';

export { AnnotationAst, parseAnnotationFromString };
export const JsdocKey = 'mantastyle';

const MANTA_STYLE_ANNOTATION_REGEX = new RegExp(
  `@${JsdocKey}\\s+({{[\\s\\S]+(?=}})}})`,
);

export function extractMantaStyleJSDocContent(
  multilineComment: string,
): string {
  const match = multilineComment.match(MANTA_STYLE_ANNOTATION_REGEX);
  if (match) {
    return cleanMantaStyleJSDocContent(match[1]);
  }
  return '';
}

export function cleanMantaStyleJSDocContent(multilineContent: string): string {
  multilineContent = multilineContent.trimLeft();
  if (multilineContent.startsWith('{{')) {
    let bracketEnd = 2;
    let quoteMode = false;
    let singleQuote = false;
    loop: while (true) {
      switch (multilineContent[bracketEnd]) {
        case '\\':
          bracketEnd++;
          break;
        case '}': {
          if (!quoteMode && multilineContent[bracketEnd + 1] === '}') {
            break loop;
          }
        }
        case '"':
        case "'":
          if (quoteMode) {
            if (
              (singleQuote && multilineContent[bracketEnd] === "'") ||
              (!singleQuote && multilineContent[bracketEnd] === '"')
            ) {
              quoteMode = false;
            }
          } else {
            quoteMode = true;
            singleQuote = multilineContent[bracketEnd] === "'";
          }
      }
      bracketEnd++;
    }
    return multilineContent.substring(0, bracketEnd + 2);
  }
  return '';
}
