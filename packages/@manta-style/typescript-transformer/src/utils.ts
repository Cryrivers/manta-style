import * as ts from 'typescript';
import {
  MANTASTYLE_RUNTIME_NAME,
  MANTASTYLE_HELPER_NAME,
  MANTASTYLE_HELPER_TYPES,
} from './constants';
import { isOptionalTypeNode, isRestTypeNode } from './typescript';

const enum QuestionToken {
  None,
  QuestionToken,
  MinusToken,
}

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
  initializer?: ts.Expression,
) {
  return ts.createVariableStatement(
    undefined,
    ts.createVariableDeclarationList(
      [ts.createVariableDeclaration(name, undefined, initializer)],
      ts.NodeFlags.Const,
    ),
  );
}

export function createTypeAliasDeclaration(node: ts.TypeAliasDeclaration) {
  const name = node.name.getText();
  const typeParameters = node.typeParameters || ts.createNodeArray();
  const jsdocTags = ts.getJSDocTags(node);

  const varCreation = createConstVariableStatement(
    name,
    createRuntimeFunctionCall('TypeAliasDeclaration', [
      ts.createStringLiteral(name),
      ts.createArrowFunction(
        undefined,
        undefined,
        [
          ts.createParameter(
            undefined,
            undefined,
            undefined,
            'typeFactory',
            undefined,
            undefined,
            undefined,
          ),
        ],
        undefined,
        undefined,
        ts.createBlock(
          [
            ...createTypeParameters(
              typeParameters,
              typeParameters,
              'typeFactory',
            ),
            createConstVariableStatement(
              'type',
              createMantaStyleRuntimeObject(node.type, typeParameters),
            ),
            ts.createReturn(ts.createIdentifier('type')),
          ],
          true,
        ),
      ),
      generateJSDocParam(jsdocTags),
    ]),
  );
  varCreation.modifiers = node.modifiers;
  return varCreation;
}

export function createRuntimeFunctionCall(
  methodName: string,
  argArray: ReadonlyArray<ts.Expression>,
  variableName: string = MANTASTYLE_RUNTIME_NAME,
) {
  return ts.createCall(
    ts.createPropertyAccess(
      ts.createIdentifier(variableName),
      ts.createIdentifier(methodName),
    ),
    undefined,
    argArray,
  );
}

function createRuntimePropertyRef(
  propertyName: string,
  variable = MANTASTYLE_RUNTIME_NAME,
) {
  return ts.createPropertyAccess(
    ts.createIdentifier(variable),
    ts.createIdentifier(propertyName),
  );
}

function createTypeParameters(
  typeParameters: ts.NodeArray<ts.TypeParameterDeclaration>,
  referenceTypeParameters: ts.NodeArray<ts.TypeParameterDeclaration>,
  caller: string,
): ts.Statement[] {
  const statements: ts.Statement[] = [];
  if (typeParameters) {
    for (const param of typeParameters) {
      statements.push(
        createConstVariableStatement(
          param.name.getText(),
          createRuntimeFunctionCall(
            'TypeParameter',
            [
              ts.createStringLiteral(param.name.getText()),
              ...(param.constraint
                ? [
                    createMantaStyleRuntimeObject(
                      param.constraint,
                      referenceTypeParameters,
                    ),
                  ]
                : []),
              ...(param.default
                ? [
                    createMantaStyleRuntimeObject(
                      param.default,
                      referenceTypeParameters,
                    ),
                  ]
                : []),
            ],
            caller,
          ),
        ),
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
  throw new Error('Unsupported types when creating property name.');
}

function isGenericTypeReference(
  typeName: string,
  typeParameters: ts.NodeArray<ts.TypeParameterDeclaration>,
): boolean {
  return (
    (typeParameters &&
      typeParameters.some((item) => item.name.getText() === typeName)) ||
    false
  );
}

function createTypeReferenceOrIdentifier(
  node: ts.TypeNode,
  typeParameters: ts.NodeArray<ts.TypeParameterDeclaration>,
) {
  const nodeName = node.getText();
  if (isGenericTypeReference(nodeName, typeParameters)) {
    return ts.createIdentifier(nodeName);
  }
  return createMantaStyleRuntimeObject(node, typeParameters);
}

function generateJSDocParam(jsdocArray: ReadonlyArray<ts.JSDocTag>) {
  return ts.createArrayLiteral(
    jsdocArray.map((tag) => {
      return ts.createObjectLiteral([
        ts.createPropertyAssignment(
          'key',
          ts.createStringLiteral(tag.tagName.text),
        ),
        ts.createPropertyAssignment(
          'value',
          ts.createStringLiteral(tag.comment || ''),
        ),
      ]);
    }),
  );
}

function createTypeLiteralProperties(
  members: ts.NodeArray<ts.TypeElement>,
  typeParameters: ts.NodeArray<ts.TypeParameterDeclaration>,
): ts.Statement[] {
  const statements: ts.Statement[] = [];
  for (const member of members) {
    const jsdocArray = ts.getJSDocTags(member);
    if (ts.isPropertySignature(member) && member.type) {
      statements.push(
        ts.createExpressionStatement(
          createRuntimeFunctionCall(
            'property',
            [
              createPropertyName(member),
              createTypeReferenceOrIdentifier(member.type, typeParameters),
              member.questionToken ? ts.createTrue() : ts.createFalse(),
              generateJSDocParam(jsdocArray),
            ],
            'typeLiteral',
          ),
        ),
      );
    } else if (ts.isIndexSignatureDeclaration(member)) {
      if (member.parameters.length === 1 && member.type) {
        const parameter = member.parameters[0];
        if (parameter.type) {
          statements.push(
            ts.createExpressionStatement(
              createRuntimeFunctionCall(
                'computedProperty',
                [
                  ts.createStringLiteral(parameter.name.getText()),
                  createTypeReferenceOrIdentifier(
                    parameter.type,
                    typeParameters,
                  ),
                  createTypeReferenceOrIdentifier(member.type, typeParameters),
                  ts.createNumericLiteral('0'), // ComputedPropertyOperator.INDEX_SIGNATURE
                  member.questionToken ? ts.createTrue() : ts.createFalse(),
                  generateJSDocParam(jsdocArray),
                ],
                'typeLiteral',
              ),
            ),
          );
        }
      }
    }
  }
  return statements;
}

function createBatchTypeFunctionAll(
  node: ts.UnionTypeNode | ts.IntersectionTypeNode,
  typeParameters: ts.NodeArray<ts.TypeParameterDeclaration>,
  functionName: string,
): ts.Expression {
  return createRuntimeFunctionCall(functionName, [
    ts.createArrayLiteral(
      node.types.map((item) =>
        createTypeReferenceOrIdentifier(item, typeParameters),
      ),
    ),
  ]);
}

function createUnionType(
  node: ts.UnionTypeNode,
  typeParameters: ts.NodeArray<ts.TypeParameterDeclaration>,
): ts.Expression {
  return createBatchTypeFunctionAll(node, typeParameters, 'UnionType');
}

function createIntersectionType(
  node: ts.IntersectionTypeNode,
  typeParameters: ts.NodeArray<ts.TypeParameterDeclaration>,
): ts.Expression {
  return createBatchTypeFunctionAll(node, typeParameters, 'IntersectionType');
}

function createLiteralType(node: ts.LiteralTypeNode): ts.Expression {
  return createRuntimeFunctionCall('Literal', [
    ts.createIdentifier(node.literal.getText()),
  ]);
}

function createArrayType(
  node: ts.ArrayTypeNode,
  typeParameters: ts.NodeArray<ts.TypeParameterDeclaration>,
): ts.Expression {
  return createRuntimeFunctionCall('ArrayType', [
    createMantaStyleRuntimeObject(node.elementType, typeParameters),
  ]);
}

function createMappedType(
  node: ts.MappedTypeNode,
  typeParameters: ts.NodeArray<ts.TypeParameterDeclaration>,
) {
  const referenceTypeParameters = ts.createNodeArray([
    ...typeParameters,
    node.typeParameter,
  ]);

  if (node.typeParameter.constraint && node.type) {
    return createRuntimeFunctionCall('MappedType', [
      ts.createArrowFunction(
        undefined,
        undefined,
        [
          ts.createParameter(
            undefined,
            undefined,
            undefined,
            'mappedType',
            undefined,
            undefined,
            undefined,
          ),
        ],
        undefined,
        undefined,
        ts.createBlock(
          [
            ...createTypeParameters(
              ts.createNodeArray([node.typeParameter]),
              referenceTypeParameters,
              'mappedType',
            ),
            ts.createExpressionStatement(
              createRuntimeFunctionCall(
                'setQuestionToken',
                [
                  ts.createNumericLiteral(
                    String(
                      node.questionToken
                        ? node.questionToken.kind === ts.SyntaxKind.MinusToken
                          ? QuestionToken.MinusToken
                          : QuestionToken.QuestionToken
                        : QuestionToken.None,
                    ),
                  ),
                ],
                'mappedType',
              ),
            ),
            ts.createExpressionStatement(
              createRuntimeFunctionCall(
                'setConstraint',
                [
                  createMantaStyleRuntimeObject(
                    node.typeParameter.constraint,
                    referenceTypeParameters,
                  ),
                ],
                'mappedType',
              ),
            ),
            ts.createReturn(
              createMantaStyleRuntimeObject(node.type, referenceTypeParameters),
            ),
          ],
          true,
        ),
      ),
    ]);
  } else {
    throw new Error('Invalid MappedType');
  }
}

export function createTypeLiteral(
  node: ts.TypeLiteralNode,
  typeParameters: ts.NodeArray<ts.TypeParameterDeclaration>,
) {
  return createRuntimeFunctionCall('TypeLiteral', [
    ts.createArrowFunction(
      undefined,
      undefined,
      [
        ts.createParameter(
          undefined,
          undefined,
          undefined,
          'typeLiteral',
          undefined,
          undefined,
          undefined,
        ),
      ],
      undefined,
      undefined,
      ts.createBlock(
        createTypeLiteralProperties(node.members, typeParameters),
        true,
      ),
    ),
  ]);
}

function createTypeReference(
  node: ts.TypeReferenceNode,
  typeParameters: ts.NodeArray<ts.TypeParameterDeclaration>,
): ts.Expression {
  const typeName = node.typeName.getText();

  let typeReferenceNode;
  if (MANTASTYLE_HELPER_TYPES.indexOf(typeName) > -1) {
    typeReferenceNode = ts.createPropertyAccess(
      ts.createIdentifier(MANTASTYLE_HELPER_NAME),
      ts.createIdentifier(typeName),
    );
  } else {
    typeReferenceNode = ts.createIdentifier(typeName);
  }

  if (node.typeArguments) {
    return ts.createCall(
      ts.createPropertyAccess(typeReferenceNode, 'argumentTypes'),
      [],
      [
        ts.createArrayLiteral(
          node.typeArguments.map((type) =>
            createTypeReferenceOrIdentifier(type, typeParameters),
          ),
        ),
      ],
    );
  } else {
    return typeReferenceNode;
  }
}

export function createMantaStyleRuntimeObject(
  node: ts.Node,
  typeParameters: ts.NodeArray<ts.TypeParameterDeclaration>,
): ts.Expression {
  if (ts.isTypeLiteralNode(node)) {
    return createTypeLiteral(node, typeParameters);
  } else if (ts.isUnionTypeNode(node)) {
    return createUnionType(node, typeParameters);
  } else if (ts.isIntersectionTypeNode(node)) {
    return createIntersectionType(node, typeParameters);
  } else if (ts.isLiteralTypeNode(node)) {
    return createLiteralType(node);
  } else if (ts.isParenthesizedTypeNode(node)) {
    return createRuntimeFunctionCall('ParenthesizedType', [
      createMantaStyleRuntimeObject(node.type, typeParameters),
    ]);
  } else if (ts.isArrayTypeNode(node)) {
    return createArrayType(node, typeParameters);
  } else if (ts.isTupleTypeNode(node)) {
    return createRuntimeFunctionCall('TupleType', [
      ts.createArrayLiteral(
        node.elementTypes.map((type) =>
          createMantaStyleRuntimeObject(type, typeParameters),
        ),
      ),
    ]);
  } else if (isOptionalTypeNode(node)) {
    return createRuntimeFunctionCall('OptionalType', [
      createMantaStyleRuntimeObject(node.type, typeParameters),
    ]);
  } else if (isRestTypeNode(node) && ts.isArrayTypeNode(node.type)) {
    return createRuntimeFunctionCall('RestType', [
      createMantaStyleRuntimeObject(node.type.elementType, typeParameters),
    ]);
  } else if (ts.isIndexedAccessTypeNode(node)) {
    return createRuntimeFunctionCall('IndexedAccessType', [
      createMantaStyleRuntimeObject(node.objectType, typeParameters),
      createMantaStyleRuntimeObject(node.indexType, typeParameters),
    ]);
  } else if (ts.isConditionalTypeNode(node)) {
    return createRuntimeFunctionCall('ConditionalType', [
      createMantaStyleRuntimeObject(node.checkType, typeParameters),
      createMantaStyleRuntimeObject(node.extendsType, typeParameters),
      createMantaStyleRuntimeObject(node.trueType, typeParameters),
      createMantaStyleRuntimeObject(node.falseType, typeParameters),
    ]);
  } else if (ts.isMappedTypeNode(node)) {
    return createMappedType(node, typeParameters);
  } else if (node.kind === ts.SyntaxKind.NumberKeyword) {
    return createRuntimePropertyRef('NumberKeyword');
  } else if (node.kind === ts.SyntaxKind.BooleanKeyword) {
    return createRuntimePropertyRef('BooleanKeyword');
  } else if (node.kind === ts.SyntaxKind.ObjectKeyword) {
    return createRuntimePropertyRef('ObjectKeyword');
  } else if (node.kind === ts.SyntaxKind.StringKeyword) {
    return createRuntimePropertyRef('StringKeyword');
  } else if (node.kind === ts.SyntaxKind.NeverKeyword) {
    return createRuntimePropertyRef('NeverKeyword');
  } else if (node.kind === ts.SyntaxKind.NullKeyword) {
    return createRuntimePropertyRef('NullKeyword');
  } else if (node.kind === ts.SyntaxKind.UndefinedKeyword) {
    return createRuntimePropertyRef('UndefinedKeyword');
  } else if (node.kind === ts.SyntaxKind.AnyKeyword) {
    return createRuntimePropertyRef('AnyKeyword');
  } else if (
    ts.isTypeOperatorNode(node) &&
    node.operator === ts.SyntaxKind.KeyOfKeyword
  ) {
    return createRuntimeFunctionCall('KeyOfKeyword', [
      createMantaStyleRuntimeObject(node.type, typeParameters),
    ]);
  } else if (ts.isTypeReferenceNode(node)) {
    // Special Cases
    if (
      node.typeName.getText() === 'Array' &&
      node.typeArguments &&
      node.typeArguments.length === 1
    ) {
      return createArrayType(
        ts.createArrayTypeNode(node.typeArguments[0]),
        typeParameters,
      );
    }
    return createTypeReference(node, typeParameters);
  } else {
    throw new Error(`Unhandled Type. ${node.getText()}`);
  }
}
