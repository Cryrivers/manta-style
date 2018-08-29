import * as ts from 'typescript';

export function isOptionalTypeNode(node: ts.Node): node is ts.OptionalTypeNode {
  return node.kind === ts.SyntaxKind.OptionalType;
}

export function isRestTypeNode(node: ts.Node): node is ts.RestTypeNode {
  return node.kind === ts.SyntaxKind.RestType;
}
