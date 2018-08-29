import * as ts from 'typescript';
import * as fs from 'fs';
import * as path from 'path';
import * as glob from 'glob';
import * as babelCore from 'babel-core';
import { createTransformer } from '@manta-style/typescript-transformer';

export default function build(
  fileName: string,
  destDir: string,
  verbose: boolean = false,
  importHelpers: boolean = true,
) {
  const MantaStyleTranformer = createTransformer(importHelpers);
  const program = ts.createProgram([fileName], {
    strict: true,
    noEmitOnError: true,
    target: ts.ScriptTarget.ES5,
    moduleResolution: ts.ModuleResolutionKind.NodeJs,
    module: ts.ModuleKind.ESNext,
    outDir: destDir,
    listEmittedFiles: true,
  });
  const result: ts.EmitResult = program.emit(
    undefined,
    undefined,
    undefined,
    undefined,
    {
      before: [MantaStyleTranformer],
    },
  );
  if (verbose) {
    console.log('[TYPESCRIPT] Compile Result', result);
  }
  const jsModuleFiles = glob.sync(path.join(destDir, '**/*.js'));
  for (const file of jsModuleFiles) {
    if (verbose) {
      console.log('[BABEL] Processing file: ' + file);
    }
    const result = babelCore.transformFileSync(file, {
      plugins: [require('babel-plugin-transform-es2015-modules-commonjs')],
    });
    fs.writeFileSync(file, result.code);
  }
  return (
    result.emittedFiles && result.emittedFiles[result.emittedFiles.length - 1]
  );
}
