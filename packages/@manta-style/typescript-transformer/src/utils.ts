import * as ts from "typescript";
import { MANTASTYLE_RUNTIME_NAME } from "./constants";
import { typeParameter } from "babel-types";
/*
type X = {
  haha: string
}

type X = {
  'haha': string
}

type X = {
  [key: string]: string
}

type X = {
  [key in Y]: string
}
*/

export function createConstVariableStatement(
  name: string,
  initializer?: ts.Expression
) {
  return ts.createVariableStatement(
    undefined,
    ts.createVariableDeclarationList(
      [ts.createVariableDeclaration(name, undefined, initializer)],
      ts.NodeFlags.Const
    )
  );
}

export function createRuntimeFunctionCall(
  methodName: string,
  argArray: ReadonlyArray<ts.Expression>,
  variableName: string = MANTASTYLE_RUNTIME_NAME
) {
  return ts.createCall(
    ts.createPropertyAccess(
      ts.createIdentifier(variableName),
      ts.createIdentifier(methodName)
    ),
    undefined,
    argArray
  );
}

function createRuntimePropertyRef(
  propertyName: string,
  variable = MANTASTYLE_RUNTIME_NAME
) {
  return ts.createPropertyAccess(
    ts.createIdentifier(variable),
    ts.createIdentifier(propertyName)
  );
}

function createTypeLiteralGenerics(
  typeParameters?: ts.NodeArray<ts.TypeParameterDeclaration>
): ts.Statement[] {
  const statements: ts.Statement[] = [];
  if (typeParameters) {
    for (const param of typeParameters) {
      statements.push(
        createConstVariableStatement(
          param.name.getText(),
          createRuntimeFunctionCall(
            "RefType",
            [ts.createStringLiteral(param.name.getText())],
            "type"
          )
        )
      );
    }
  }
  return statements;
}

function createPropertyName(node: ts.PropertySignature) {
  const { name } = node;
  if (ts.isStringLiteral(name)) {
    return name;
  } else if (ts.isIdentifier(name)) {
    return ts.createStringLiteral(name.getText());
  }
  throw new Error("Unsupported types when creating property name.");
}

function createTypeLiteralType(
  node: ts.TypeNode,
  typeParameters?: ts.NodeArray<ts.TypeParameterDeclaration>
) {
  // is it a generic type parameter?
  const nodeName = node.getText();
  if (
    typeParameters &&
    typeParameters.some(item => item.name.getText() === nodeName)
  ) {
    console.log("Generic: ", nodeName);
    return ts.createIdentifier(nodeName);
  }
  return createMantaStyleRuntimeObject(node, typeParameters);
}

function createTypeLiteralProperties(
  members: ts.NodeArray<ts.TypeElement>,
  typeParameters?: ts.NodeArray<ts.TypeParameterDeclaration>
): ts.Statement[] {
  const statements: ts.Statement[] = [];
  for (const member of members) {
    if (ts.isPropertySignature(member) && member.type) {
      statements.push(
        ts.createStatement(
          createRuntimeFunctionCall(
            "property",
            [
              createPropertyName(member),
              createTypeLiteralType(member.type, typeParameters),
              member.questionToken ? ts.createTrue() : ts.createFalse()
            ],
            "type"
          )
        )
      );
    } else if (ts.isIndexSignatureDeclaration(member)) {
      // TODO: To be implemented
    }
  }
  return statements;
}

function createUnionType(node: ts.UnionTypeNode): ts.Expression {
  return createRuntimeFunctionCall("UnionType", [
    ts.createArrayLiteral(
      node.types.map(item => createMantaStyleRuntimeObject(item))
    )
  ]);
}

function createLiteralType(node: ts.LiteralTypeNode): ts.Expression {
  return createRuntimeFunctionCall("LiteralType", [
    ts.createIdentifier(node.literal.getText())
  ]);
}

function createArrayType(node: ts.ArrayTypeNode): ts.Expression {
  return createRuntimeFunctionCall("ArrayType", [
    createMantaStyleRuntimeObject(node.elementType)
  ]);
}

export function createTypeLiteral(
  node: ts.TypeLiteralNode,
  typeParameters?: ts.NodeArray<ts.TypeParameterDeclaration>
) {
  return createRuntimeFunctionCall("TypeLiteral", [
    ts.createArrowFunction(
      undefined,
      undefined,
      [
        ts.createParameter(
          undefined,
          undefined,
          undefined,
          "type",
          undefined,
          undefined,
          undefined
        )
      ],
      undefined,
      undefined,
      ts.createBlock(
        [
          ...createTypeLiteralGenerics(typeParameters),
          ...createTypeLiteralProperties(node.members)
        ],
        true
      )
    )
  ]);
}

function createTypeReference(node: ts.TypeReferenceNode): ts.Expression {
  const typeReferenceCallExpression = createRuntimeFunctionCall(
    "TypeReference",
    [ts.createStringLiteral(node.typeName.getText())]
  );
  if (node.typeArguments) {
    return ts.createCall(
      ts.createPropertyAccess(typeReferenceCallExpression, "ref"),
      [],
      [
        ts.createArrayLiteral(
          node.typeArguments.map(type => createMantaStyleRuntimeObject(type))
        )
      ]
    );
  } else {
    return typeReferenceCallExpression;
  }
}

export function createMantaStyleRuntimeObject(
  node: ts.Node,
  typeParameters?: ts.NodeArray<ts.TypeParameterDeclaration>
): ts.Expression {
  if (ts.isTypeLiteralNode(node)) {
    return createTypeLiteral(node, typeParameters);
  } else if (ts.isUnionTypeNode(node)) {
    return createUnionType(node);
  } else if (ts.isLiteralTypeNode(node)) {
    return createLiteralType(node);
  } else if (ts.isArrayTypeNode(node)) {
    return createArrayType(node);
  } else if (node.kind === ts.SyntaxKind.NumberKeyword) {
    return createRuntimePropertyRef("NumberKeyword");
  } else if (node.kind === ts.SyntaxKind.BooleanKeyword) {
    return createRuntimePropertyRef("BooleanKeyword");
  } else if (node.kind === ts.SyntaxKind.StringKeyword) {
    return createRuntimePropertyRef("StringKeyword");
  } else if (node.kind === ts.SyntaxKind.NeverKeyword) {
    return createRuntimePropertyRef("NeverKeyword");
  } else if (node.kind === ts.SyntaxKind.NullKeyword) {
    return createRuntimePropertyRef("NullKeyword");
  } else if (node.kind === ts.SyntaxKind.UndefinedKeyword) {
    return createRuntimePropertyRef("UndefinedKeyword");
  } else if (node.kind === ts.SyntaxKind.AnyKeyword) {
    return createRuntimePropertyRef("AnyKeyword");
  } else if (
    ts.isTypeOperatorNode(node) &&
    node.operator === ts.SyntaxKind.KeyOfKeyword
  ) {
    return createRuntimeFunctionCall("KeyOfKeyword", [
      createMantaStyleRuntimeObject(node.type)
    ]);
  } else if (ts.isTypeReferenceNode(node)) {
    // Array Special Case
    if (
      node.typeName.getText() === "Array" &&
      node.typeArguments &&
      node.typeArguments.length === 1
    ) {
      return createArrayType(ts.createArrayTypeNode(node.typeArguments[0]));
    } else if (
      node.typeName.getText() === "ReadOnly" &&
      node.typeArguments &&
      node.typeArguments.length === 1
    ) {
      return createMantaStyleRuntimeObject(node.typeArguments[0]);
    } else if (
      node.typeName.getText() === "Partial" &&
      node.typeArguments &&
      node.typeArguments.length === 1
    ) {
      return createRuntimeFunctionCall("Partial", [
        createMantaStyleRuntimeObject(node.typeArguments[0])
      ]);
    } else if (
      node.typeName.getText() === "Required" &&
      node.typeArguments &&
      node.typeArguments.length === 1
    ) {
      return createRuntimeFunctionCall("Required", [
        createMantaStyleRuntimeObject(node.typeArguments[0])
      ]);
    }
    return createTypeReference(node);
  } else {
    throw new Error(`Unhandled Type. ${node.getText()}`);
  }
}
