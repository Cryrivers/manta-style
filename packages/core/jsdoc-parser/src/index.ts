import { Annotation } from '@manta-style/core';

const regex = /(@\S[^@]+)/g;
export default function commentToJsdoc(comment: string): Annotation[] {
  const result = [];
  const jsdocRegex = new RegExp(regex);
  let match = null;
  while ((match = jsdocRegex.exec(comment))) {
    const matchString = match[0];
    const space = matchString.indexOf(' ');
    let key, value;
    if (space === -1) {
      key = matchString.trim();
      value = '';
    } else {
      key = matchString.slice(0, space).trim();
      value = matchString.slice(space + 1).trim();
    }
    result.push({ key, value });
  }
  return result;
}
