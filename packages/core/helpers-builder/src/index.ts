import * as ts from 'typescript';
import * as fs from 'fs';

export function extractExportName(sourceFile: string, destFile: string) {
  const sourceCode = fs.readFileSync(sourceFile, 'utf-8');
  const tsSourceFile = ts.createSourceFile(
    'test.ts',
    sourceCode,
    ts.ScriptTarget.ES5,
    true,
    ts.ScriptKind.TS,
  );
  const typeAliasDeclarationArray = tsSourceFile.statements
    .filter(
      (statement) =>
        ts.isTypeAliasDeclaration(statement) &&
        statement.modifiers &&
        statement.modifiers.findIndex(
          (modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword,
        ) > -1,
    )
    .map(
      // @ts-ignore
      (typeAliasDeclaration: ts.TypeAliasDeclaration) =>
        typeAliasDeclaration.name.text,
    );
  const code = `// Generated content. Do not modify.\nexport default ${JSON.stringify(
    typeAliasDeclarationArray,
  )};`;
  fs.writeFileSync(destFile, code, 'utf-8');
}
