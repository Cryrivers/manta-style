import * as ts from 'typescript';
import { createTransformer } from '../src';

const transformer = createTransformer(true);
export function getTranspiledString(source: string): string {
  const sourceFile = ts.createSourceFile(
    'test.ts',
    source,
    ts.ScriptTarget.ES2017,
    true,
    ts.ScriptKind.TS,
  );
  const result = ts.transform(sourceFile, [transformer]);
  const printer = ts.createPrinter({
    newLine: ts.NewLineKind.LineFeed,
  });
  return printer.printFile(result.transformed[0]);
}
