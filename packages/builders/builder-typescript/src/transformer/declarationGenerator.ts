import * as ts from 'typescript';
import {
  MANTASTYLE_HELPER_NAME,
  HELPER_PACKAGE_NAME,
  MANTASTYLE_RUNTIME_NAME,
  MANTASTYLE_PACKAGE_NAME,
} from './constants';

function generateTypeDeclaration(
  node: ts.TypeAliasDeclaration | ts.InterfaceDeclaration,
) {
  const isExport =
    node.modifiers &&
    node.modifiers.find((item) => item.kind === ts.SyntaxKind.ExportKeyword);
  const genericParams = node.typeParameters
    ? node.typeParameters.map((_) => 'any')
    : [];
  return [
    node.getFullText(),
    `${
      isExport ? 'export ' : ''
    }declare const ${node.name.getText()}: Type<${node.name.getText()}${
      genericParams.length > 0 ? '<' + genericParams.join(',') + '>' : ''
    }>;`,
  ];
}

function generateEnumDeclaration(node: ts.EnumDeclaration) {
  const isExport =
    node.modifiers &&
    node.modifiers.find((item) => item.kind === ts.SyntaxKind.ExportKeyword);
  const tsEnumDeclarations: string[] = [];
  tsEnumDeclarations.push(
    `${isExport ? 'export ' : ''}declare const enum ${node.name.getText()} {`,
  );
  let numericInitializerCounter = 0;
  for (const member of node.members) {
    const { initializer } = member;
    if (initializer && ts.isNumericLiteral(initializer)) {
      numericInitializerCounter = Number(initializer.getText());
    }
    tsEnumDeclarations.push(
      `    ${member.name.getText()} = ${
        initializer ? initializer.getText() : numericInitializerCounter
      },`,
    );
    numericInitializerCounter++;
  }
  tsEnumDeclarations.push('}');
  return tsEnumDeclarations;
}
export default function declarationGenerator(
  sourceFile: ts.SourceFile,
  importHelpers: boolean,
) {
  const declaration: string[] = [];
  generateDeclarationByNode(sourceFile);
  function generateDeclarationByNode(node: ts.Node) {
    if (ts.isTypeAliasDeclaration(node) || ts.isInterfaceDeclaration(node)) {
      declaration.push(...generateTypeDeclaration(node));
    } else if (ts.isEnumDeclaration(node)) {
      declaration.push(...generateEnumDeclaration(node));
    } else if (ts.isExportAssignment(node)) {
      declaration.push(node.getText());
    } else if (ts.isExportDeclaration(node) || ts.isImportDeclaration(node)) {
      debugger;
      declaration.push(node.getText());
    }
    ts.forEachChild(node, generateDeclarationByNode);
  }
  if (importHelpers) {
    declaration.unshift(
      `import * as ${MANTASTYLE_HELPER_NAME} from "${HELPER_PACKAGE_NAME}";`,
    );
  }
  declaration.unshift(
    `import { Type } from "@manta-style/core";`,
    `import ${MANTASTYLE_RUNTIME_NAME} from "${MANTASTYLE_PACKAGE_NAME}";`,
  );
  return declaration.join('\n');
}
