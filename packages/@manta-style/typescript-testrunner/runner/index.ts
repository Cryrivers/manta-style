import * as ts from "typescript";
import MantaStyleTranformer from "@manta-style/typescript-transformer";
import * as glob from "glob";
import * as babelCore from "babel-core";
import * as fs from "fs";

function compile(fileNames: string[], options: ts.CompilerOptions): void {
  const program = ts.createProgram(fileNames, options);

  const emitResult = program.emit(undefined, undefined, undefined, undefined, {
    before: [MantaStyleTranformer]
  });
  const allDiagnostics = ts
    .getPreEmitDiagnostics(program)
    .concat(emitResult.diagnostics);

  allDiagnostics.forEach(diagnostic => {
    if (diagnostic.file) {
      const { line, character } = diagnostic.file.getLineAndCharacterOfPosition(
        diagnostic.start!
      );
      const message = ts.flattenDiagnosticMessageText(
        diagnostic.messageText,
        "\n"
      );
      console.log(
        `${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`
      );
    } else {
      console.log(
        `${ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n")}`
      );
    }
  });

  const exitCode = emitResult.emitSkipped ? 1 : 0;
  console.log(`TypeScript Process exits with code '${exitCode}'.`);
}

const typescriptFiles = glob.sync(__dirname + "/../testcases/**/*.ts");
compile(typescriptFiles, {
  strict: true,
  noEmitOnError: true,
  target: ts.ScriptTarget.ES5,
  moduleResolution: ts.ModuleResolutionKind.NodeJs,
  module: ts.ModuleKind.ESNext
});

const jsModuleFiles = glob.sync(__dirname + "/../testcases/**/*.js");

for (const file of jsModuleFiles) {
  const result = babelCore.transformFileSync(file, {
    plugins: ["transform-es2015-modules-commonjs"]
  });
  fs.writeFileSync(file, result.code);
}

console.log(`Babel Process exits.`);
