import * as ts from 'typescript';
import { createTypeAliasDeclaration } from './utils';
import {
  MANTASTYLE_RUNTIME_NAME,
  MANTASTYLE_PACKAGE_NAME,
  MANTASTYLE_HELPER_NAME,
  HELPER_PACKAGE_NAME,
} from './constants';
import * as fs from 'fs';
import * as path from 'path';

function generateDeclarationForTypeAlias(
  node: ts.TypeAliasDeclaration | ts.InterfaceDeclaration,
) {
  const isExport =
    node.modifiers &&
    node.modifiers.find((item) => item.kind === ts.SyntaxKind.ExportKeyword);
  return [
    node.getText(),
    `${
      isExport ? 'export ' : ''
    }declare const ${node.name.getText()}: Type<${node.name.getText()}>;`,
  ];
}

export function createTransformer(importHelpers: boolean, destDir?: string) {
  const transformer: ts.TransformerFactory<ts.SourceFile> = (context) => {
    const declarationFile: string[] = [];
    const MantaStyleRuntimeTypeVisitor: ts.Visitor = (node) => {
      if (ts.isTypeAliasDeclaration(node)) {
        declarationFile.push(...generateDeclarationForTypeAlias(node));
        return createTypeAliasDeclaration(node);
      } else if (ts.isInterfaceDeclaration(node)) {
        declarationFile.push(...generateDeclarationForTypeAlias(node));
        return createTypeAliasDeclaration(
          ts.createTypeAliasDeclaration(
            node.decorators,
            node.modifiers,
            node.name,
            node.typeParameters,
            ts.createTypeLiteralNode(node.members),
          ),
        );
      } else if (ts.isImportSpecifier(node)) {
        // Do not erase type import
        // TODO: It might be wrong
        return ts.createImportSpecifier(node.propertyName, node.name);
      } else if (ts.isExportAssignment(node)) {
        declarationFile.push(node.getText());
        // Do not erase type export
        // TODO: It might be wrong
        return ts.createExportAssignment(
          node.decorators,
          node.modifiers,
          node.isExportEquals || false,
          node.expression,
        );
      } else if (ts.isExportDeclaration(node) || ts.isImportDeclaration(node)) {
        declarationFile.push(node.getText());
      }
      return ts.visitEachChild(node, MantaStyleRuntimeTypeVisitor, context);
    };
    return (sourceFile) => {
      const transformedNode = ts.visitNode(
        sourceFile,
        MantaStyleRuntimeTypeVisitor,
      );
      if (importHelpers) {
        declarationFile.unshift(
          `import * as ${MANTASTYLE_HELPER_NAME} from "${HELPER_PACKAGE_NAME}";`,
        );
      }
      declarationFile.unshift(
        `import { Type } from "@manta-style/core";`,
        `import ${MANTASTYLE_RUNTIME_NAME} from "${MANTASTYLE_PACKAGE_NAME}";`,
      );
      if (destDir) {
        // it only supports files without external reference.
        // TODO: Resolve module references and put them to the correct folder
        const srcFullName = path.basename(
          sourceFile.fileName.replace(/\.ts$/g, '.d.ts'),
        );
        // Write down the declaration file if targetDir is specified
        fs.mkdirSync(destDir);
        fs.writeFileSync(
          path.resolve(destDir, srcFullName),
          declarationFile.join('\n'),
        );
      }
      return ts.updateSourceFileNode(transformedNode, [
        ts.createImportDeclaration(
          [],
          [],
          ts.createImportClause(
            ts.createIdentifier(MANTASTYLE_RUNTIME_NAME),
            undefined,
          ),
          ts.createLiteral(MANTASTYLE_PACKAGE_NAME),
        ),
        ...(importHelpers
          ? [
              ts.createImportDeclaration(
                [],
                [],
                ts.createImportClause(
                  undefined,
                  ts.createNamespaceImport(
                    ts.createIdentifier(MANTASTYLE_HELPER_NAME),
                  ),
                ),
                ts.createLiteral(HELPER_PACKAGE_NAME),
              ),
            ]
          : []),
        ...transformedNode.statements,
      ]);
    };
  };
  return transformer;
}
