import * as ts from 'typescript';
import { types as bb } from 'babel-core';
import { MANTASTYLE_RUNTIME_NAME } from './constants';
import { QuestionToken, ReservedTypePrefix } from '@manta-style/consts';
import { identifier } from 'babel-types';

type LiteralType =
  | bb.BooleanLiteralTypeAnnotation
  | bb.NullLiteralTypeAnnotation
  | bb.NumericLiteralTypeAnnotation
  | bb.StringLiteralTypeAnnotation;

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
  initializer?: bb.Expression,
) {
  return bb.variableDeclaration('const', [
    bb.variableDeclarator(bb.identifier(name), initializer),
  ]);
}

export function createTypeAliasDeclaration(node: bb.TypeAlias) {
  const { name } = node.id;
  const typeParameters: bb.TypeParameter[] =
    (node.typeParameters && node.typeParameters.params) || [];
  const jsdocTags: string[] = []; // TODO: ts.getJSDocTags(node);
  const varCreation = createConstVariableStatement(
    name,
    bb.functionExpression(
      undefined,
      undefined,
      bb.blockStatement([
        bb.returnStatement(
          createRuntimeFunctionCall('TypeAliasDeclaration', [
            bb.stringLiteral(name),
            bb.arrowFunctionExpression(
              undefined,
              bb.blockStatement([
                ...createTypeParameters(
                  typeParameters,
                  typeParameters,
                  'typeFactory',
                ),
                createConstVariableStatement(
                  'type',
                  createMantaStyleRuntimeObject(node.right, typeParameters),
                ),
                bb.returnStatement(identifier('type')),
              ]),
            ),
            generateJSDocParam(jsdocTags),
          ]),
        ),
      ]),
    ),
  );
  const registerToRuntime = createRuntimeFunctionCall('registerType', [
    bb.stringLiteral(name),
    bb.identifier(name),
  ]);
  return [varCreation, registerToRuntime];
}

export function createRuntimeFunctionCall(
  methodName: string,
  argArray: bb.Expression[],
  variableName: string = MANTASTYLE_RUNTIME_NAME,
) {
  return bb.callExpression(
    bb.memberExpression(bb.identifier(variableName), bb.identifier(methodName)),
    argArray,
  );
}

function createRuntimePropertyRef(
  propertyName: string,
  variable = MANTASTYLE_RUNTIME_NAME,
) {
  return bb.memberExpression(
    bb.identifier(variable),
    bb.identifier(propertyName),
  );
}

function createTypeParameters(
  typeParameters: bb.TypeParameter[],
  referenceTypeParameters: bb.TypeParameter[],
  caller: string,
): bb.Statement[] {
  const statements: bb.Statement[] = [];
  if (typeParameters) {
    for (const param of typeParameters) {
      statements.push(
        createConstVariableStatement(
          param.name || '',
          createRuntimeFunctionCall(
            'TypeParameter',
            [
              bb.stringLiteral(param.name || ''),
              ...(param.bound
                ? [
                    createMantaStyleRuntimeObject(
                      param.bound.typeAnnotation,
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

function createPropertyName(node: bb.ObjectTypeProperty) {
  const { key } = node;
  if (bb.isIdentifier(key)) {
    return ts.createStringLiteral(key.name);
  }
  throw new Error('Unsupported types when creating property name.');
}

function isGenericTypeReference(
  typeName: string,
  typeParameters: bb.TypeParameter[],
): boolean {
  return (
    (typeParameters && typeParameters.some((item) => item.name === typeName)) ||
    false
  );
}

function createTypeReferenceOrIdentifier(
  node: bb.GenericTypeAnnotation,
  typeParameters: bb.TypeParameter[],
) {
  const nodeName = node.id.name;
  if (isGenericTypeReference(nodeName, typeParameters)) {
    return ts.createIdentifier(nodeName);
  }
  return createMantaStyleRuntimeObject(node, typeParameters);
}

function generateJSDocParam(jsdocArray: string[]) {
  return bb.arrayExpression();
  // return ts.createArrayLiteral(
  //   jsdocArray.map((tag) => {
  //     return ts.createObjectLiteral([
  //       ts.createPropertyAssignment(
  //         'key',
  //         ts.createStringLiteral(tag.tagName.text),
  //       ),
  //       ts.createPropertyAssignment(
  //         'value',
  //         ts.createStringLiteral(tag.comment || ''),
  //       ),
  //     ]);
  //   }),
  // );
}

function createTypeLiteralProperties(
  members: bb.ObjectTypeProperty[],
  indexers: bb.ObjectTypeIndexer[],
  typeParameters: bb.TypeParameter[],
): bb.Statement[] {
  const statements: bb.Statement[] = [];
  for (const member of members) {
    const jsdocArray: string[] = []; //TODO: ts.getJSDocTags(member);
    statements.push(
      bb.expressionStatement(
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
  }
  for (const indexer of indexers) {
    /*
    statements.push(
      bb.expressionStatement(
        createRuntimeFunctionCall(
          'computedProperty',
          [
            ts.createStringLiteral(parameter.name.getText()),
            createTypeReferenceOrIdentifier(parameter.type, typeParameters),
            createTypeReferenceOrIdentifier(member.type, typeParameters),
            ts.createNumericLiteral('0'), // ComputedPropertyOperator.INDEX_SIGNATURE
            member.questionToken ? ts.createTrue() : ts.createFalse(),
            generateJSDocParam(jsdocArray),
          ],
          'typeLiteral',
        ),
      ),
    );
    */
  }
  return statements;
}

function createBatchTypeFunctionAll(
  node: bb.UnionTypeAnnotation | bb.IntersectionTypeAnnotation,
  typeParameters: bb.TypeParameter[],
  functionName: string,
): bb.Expression {
  return createRuntimeFunctionCall(functionName, [
    bb.arrayExpression(
      node.types.map((item) =>
        createTypeReferenceOrIdentifier(item, typeParameters),
      ),
    ),
  ]);
}

function createUnionType(
  node: bb.UnionTypeAnnotation,
  typeParameters: bb.TypeParameter[],
): bb.Expression {
  return createBatchTypeFunctionAll(node, typeParameters, 'UnionType');
}

function createIntersectionType(
  node: bb.IntersectionTypeAnnotation,
  typeParameters: bb.TypeParameter[],
): bb.Expression {
  return createBatchTypeFunctionAll(node, typeParameters, 'IntersectionType');
}

function createLiteralType(node: LiteralType): bb.Expression {
  return createRuntimeFunctionCall('Literal', [bb.identifier(node.value)]);
}

function createArrayType(
  node: bb.ArrayTypeAnnotation,
  typeParameters: bb.TypeParameter[],
): bb.Expression {
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
  node: bb.ObjectTypeAnnotation,
  typeParameters: bb.TypeParameter[],
) {
  return createRuntimeFunctionCall('TypeLiteral', [
    bb.arrowFunctionExpression(
      [bb.identifier('typeLiteral')],
      bb.blockStatement(
        createTypeLiteralProperties(node.properties, typeParameters),
      ),
    ),
  ]);
}

function createTypeReference(
  node: bb.GenericTypeAnnotation,
  typeParameters: bb.TypeParameter[],
): bb.Expression {
  const typeName = node.id.name;
  // Magic type to convert query string to types
  if (typeName === 'unstable_Query' && node.typeParameters) {
    const queryKey = node.typeParameters.params[0];
    if (
      ts.isLiteralTypeNode(queryKey) &&
      ts.isStringLiteral(queryKey.literal)
    ) {
      return createRuntimeFunctionCall('TypeReference', [
        bb.stringLiteral(
          `${ReservedTypePrefix.URLQuery}${queryKey.literal.text}`,
        ),
      ]);
    } else {
      throw Error('key in unstable_Query is not a string literal.');
    }
  }
  const typeReferenceNode = isGenericTypeReference(typeName, typeParameters)
    ? ts.createIdentifier(typeName)
    : createRuntimeFunctionCall('TypeReference', [
        ts.createStringLiteral(typeName),
      ]);
  if (node.typeParameters && node.typeParameters.params) {
    return bb.callExpression(
      bb.memberExpression(typeReferenceNode, bb.identifier('argumentTypes')),
      [
        bb.arrayExpression(
          node.typeParameters.params.map((type) =>
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
  node: bb.Node,
  typeParameters: bb.TypeParameter[],
): bb.Expression {
  if (bb.isObjectTypeAnnotation(node)) {
    return createTypeLiteral(node, typeParameters);
  } else if (bb.isUnionTypeAnnotation(node)) {
    return createUnionType(node, typeParameters);
  } else if (bb.isIntersectionTypeAnnotation(node)) {
    return createIntersectionType(node, typeParameters);
  } else if (ts.isLiteralTypeNode(node)) {
    return createLiteralType(node);
  } else if (bb.isArrayTypeAnnotation(node)) {
    return createArrayType(node, typeParameters);
  } else if (bb.isTupleTypeAnnotation(node)) {
    return createRuntimeFunctionCall('TupleType', [
      bb.arrayExpression(
        node.types.map((type) =>
          createMantaStyleRuntimeObject(type, typeParameters),
        ),
      ),
    ]);
  } else if (bb.isNullableTypeAnnotation(node)) {
    // TODO: This is not correct
    // should have a NullableType at runtime for Flow
    return createRuntimeFunctionCall('OptionalType', [
      createMantaStyleRuntimeObject(node.typeAnnotation, typeParameters),
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
  } else if (bb.isNumberTypeAnnotation(node)) {
    return createRuntimePropertyRef('NumberKeyword');
  } else if (bb.isBooleanTypeAnnotation(node)) {
    return createRuntimePropertyRef('BooleanKeyword');
  } else if (bb.isObjectTypeAnnotation(node)) {
    return createRuntimePropertyRef('ObjectKeyword');
  } else if (bb.isStringTypeAnnotation(node)) {
    return createRuntimePropertyRef('StringKeyword');
  } else if (node.type === 'EmptyTypeAnnotation') {
    return createRuntimePropertyRef('NeverKeyword');
  } else if (bb.isNullLiteralTypeAnnotation(node)) {
    return createRuntimePropertyRef('NullKeyword');
  } else if (bb.isGenericTypeAnnotation(node) && node.id.name === 'undefined') {
    return createRuntimePropertyRef('UndefinedKeyword');
  } else if (bb.isAnyTypeAnnotation(node)) {
    return createRuntimePropertyRef('AnyKeyword');
  } else if (bb.isGenericTypeAnnotation(node)) {
    // Special Cases
    if (
      node.id.name === 'Array' &&
      node.typeParameters &&
      node.typeParameters.params.length === 1
    ) {
      return createArrayType(
        ts.createArrayTypeNode(node.typeParameters.params[0]),
        typeParameters,
      );
    }
    return createTypeReference(node, typeParameters);
  } else {
    throw new Error(`Unhandled Type. ${node.type}`);
  }
}
