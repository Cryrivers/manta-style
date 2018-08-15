import * as babel from 'babel-core';
import { createTransformer } from '../src';

const transformer = createTransformer(true);
export function getTranspiledString(source: string): string {
  const result = babel.transform(source, {
    plugins: [transformer],
  });
  return result.code || '';
}
