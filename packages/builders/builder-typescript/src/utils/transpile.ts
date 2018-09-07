import * as ts from 'typescript';
import { createTransformer } from '../transformer';

export default function transpile(
  sourceCode: string,
  importHelpers: boolean = true,
): string {
  const MantaStyleTranformer = createTransformer(importHelpers);
  const sourceFile = ts.createSourceFile(
    'test.ts',
    sourceCode,
    ts.ScriptTarget.ES5,
    true,
    ts.ScriptKind.TS,
  );
  const result = ts.transform(sourceFile, [MantaStyleTranformer]);
  const printer = ts.createPrinter({
    newLine: ts.NewLineKind.LineFeed,
  });
  const transpiledResult = printer.printFile(result.transformed[0]);
  const compileResult = ts.transpileModule(transpiledResult, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
    },
  });
  return compileResult.outputText;
}
