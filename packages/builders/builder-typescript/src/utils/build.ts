import * as ts from 'typescript';
import * as fs from 'fs';
import * as path from 'path';
import * as glob from 'glob';
import * as babelCore from '@babel/core';
import { createTransformer } from '../transformer';
import declarationGenerator from '../transformer/declarationGenerator';

export default function build({
  fileName,
  destDir,
  transpileModule,
  verbose = false,
  importHelpers = true,
}: {
  fileName: string;
  destDir: string;
  transpileModule: boolean;
  verbose?: boolean;
  importHelpers?: boolean;
}) {
  const MantaStyleTranformer = createTransformer(importHelpers, destDir);
  const program = ts.createProgram([fileName], {
    strict: true,
    noEmitOnError: true,
    target: ts.ScriptTarget.ES5,
    moduleResolution: ts.ModuleResolutionKind.NodeJs,
    module: ts.ModuleKind.ESNext,
    // We output our customized declaration file
    // therefore we wont let TS compiler output dts
    declaration: false,
    // Do not scan and compile third-party libraries
    // which make the compiling process likely to fail
    // and very slow
    types: [],
    typeRoots: [],
    outDir: destDir,
    listEmittedFiles: true,
  });
  const result: ts.EmitResult = program.emit(
    undefined,
    function generateTypeDeclaration(
      fileName,
      data,
      writeByteOrderMark,
      onError,
      sourceFiles,
    ) {
      try {
        fs.mkdirSync(path.dirname(fileName));
      } catch {
        // Empty
      }
      // Write compiled file
      fs.writeFileSync(fileName, data);
      // Write declaration file
      if (sourceFiles) {
        sourceFiles.forEach((sourceFile) => {
          const sourceCode = fs.readFileSync(sourceFile.fileName, {
            encoding: 'utf8',
          });
          const originalSourceFile = ts.createSourceFile(
            sourceFile.fileName,
            sourceCode,
            ts.ScriptTarget.Latest,
            true,
            ts.ScriptKind.TS,
          );
          if (verbose) {
            console.log(
              'Generating Customized Declaration File for: ',
              originalSourceFile.fileName,
            );
          }
          const declarationString = declarationGenerator(
            originalSourceFile,
            importHelpers,
          );
          const srcFullName = fileName.replace(/\.[jt]s$/g, '.d.ts');
          fs.writeFileSync(path.resolve(srcFullName), declarationString);
        });
      }
    },
    undefined,
    undefined,
    {
      before: [MantaStyleTranformer],
    },
  );
  if (verbose) {
    console.log('[TYPESCRIPT] Compile Result', result);
  }
  if (transpileModule) {
    const jsModuleFiles = glob.sync(path.join(destDir, '**/*.js'));
    for (const file of jsModuleFiles) {
      if (verbose) {
        console.log('[BABEL] Processing file: ' + file);
      }
      const result = babelCore.transformFileSync(file, {
        presets: [require('@babel/preset-env')],
        plugins: [require('@babel/plugin-transform-modules-commonjs')],
      });

      if (result) {
        fs.writeFileSync(file, result.code);
      } else {
        throw new Error('Babel failed to compile the config file.');
      }
    }
  }
  return (
    result.emittedFiles && result.emittedFiles[result.emittedFiles.length - 1]
  );
}
