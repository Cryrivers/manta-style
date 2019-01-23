import * as ts from 'typescript';
import { createTypeAliasDeclaration, createEnumDeclaration } from './utils';
import {
  MANTASTYLE_RUNTIME_NAME,
  MANTASTYLE_PACKAGE_NAME,
  MANTASTYLE_HELPER_NAME,
  HELPER_PACKAGE_NAME,
} from './constants';
import * as fs from 'fs';
import * as path from 'path';

export function createTransformer(importHelpers: boolean, destDir?: string) {
  const transformer: ts.TransformerFactory<ts.SourceFile> = (context) => {
    const declarationFile: string[] = [];
    const MantaStyleRuntimeTypeVisitor: ts.Visitor = (node) => {
      if (ts.isTypeAliasDeclaration(node)) {
        return createTypeAliasDeclaration(node);
      } else if (ts.isInterfaceDeclaration(node)) {
        return createTypeAliasDeclaration(
          ts.createTypeAliasDeclaration(
            node.decorators,
            node.modifiers,
            node.name,
            node.typeParameters,
            ts.createTypeLiteralNode(node.members),
          ),
        );
      } else if (ts.isEnumDeclaration(node)) {
        return createEnumDeclaration(node);
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
