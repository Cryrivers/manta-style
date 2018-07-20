import * as ts from "typescript";
import {
  createMantaStyleRuntimeObject,
  createConstVariableStatement,
  createRuntimeFunctionCall
} from "./utils";
import { MANTASTYLE_RUNTIME_NAME, MANTASTYLE_PACKAGE_NAME } from "./constants";

const transformer: ts.TransformerFactory<ts.SourceFile> = context => {
  const MantaStyleRuntimeTypeVisitor: ts.Visitor = node => {
    if (ts.isTypeAliasDeclaration(node)) {
      const typeAliasName = node.name.getText();
      const varCreation = createConstVariableStatement(
        typeAliasName,
        createMantaStyleRuntimeObject(node.type, node.typeParameters)
      );
      const registerToRuntime = createRuntimeFunctionCall("_registerType", [
        ts.createStringLiteral(typeAliasName),
        ts.createIdentifier(typeAliasName)
      ]);
      varCreation.modifiers = node.modifiers;
      return [varCreation, registerToRuntime];
    } else if (ts.isInterfaceDeclaration(node)) {
      const interfaceName = node.name.getText();
      const varCreation = createConstVariableStatement(
        interfaceName,
        createMantaStyleRuntimeObject(
          ts.createTypeLiteralNode(node.members),
          node.typeParameters
        )
      );
      const registerToRuntime = createRuntimeFunctionCall("_registerType", [
        ts.createStringLiteral(interfaceName),
        ts.createIdentifier(interfaceName)
      ]);
      varCreation.modifiers = node.modifiers;
      return [varCreation, registerToRuntime];
    } else if (ts.isImportSpecifier(node)) {
      // Do not erase type import
      // TODO: It might be wrong
      return ts.createImportSpecifier(node.propertyName, node.name);
    } else if (ts.isExportAssignment(node)) {
      // Do not erase type export
      // TODO: It might be wrong
      return ts.createExportAssignment(
        node.decorators,
        node.modifiers,
        node.isExportEquals || false,
        node.expression
      );
    }
    return ts.visitEachChild(node, MantaStyleRuntimeTypeVisitor, context);
  };
  return sourceFile => {
    const preappendedSource = ts.updateSourceFileNode(sourceFile, [
      ts.createImportDeclaration(
        [],
        [],
        ts.createImportClause(
          ts.createIdentifier(MANTASTYLE_RUNTIME_NAME),
          undefined
        ),
        ts.createLiteral(MANTASTYLE_PACKAGE_NAME)
      ),
      ...sourceFile.statements
    ]);
    const visitedNode = ts.visitNode(
      preappendedSource,
      MantaStyleRuntimeTypeVisitor
    );
    return visitedNode;
  };
};

export default transformer;
