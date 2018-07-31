import * as ts from 'typescript';

export function isOptionalType(node: ts.Node): node is ts.OptionalTypeNode {
  return node.kind === ts.SyntaxKind.OptionalType;
}

export function isRestType(node: ts.Node): node is ts.RestTypeNode {
  return node.kind === ts.SyntaxKind.RestType;
}
