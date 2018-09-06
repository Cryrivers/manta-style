import * as Babel from '@babel/core';
import babelGenerate from '@babel/generator';
import helperTypes from '@manta-style/flowtype-helpers-types';

const { types: t } = Babel;
export function createTransformer(importHelpers: boolean) {
  return function(code: string) {
    const ast = Babel.parse(code, {
      sourceType: 'module',
      plugins: [
        require('@babel/plugin-syntax-object-rest-spread'),
        require('@babel/plugin-syntax-flow'),
      ],
    });
    if (ast) {
      Babel.traverse(ast, {
        Program(path) {
          path.node.body.unshift(
            t.importDeclaration(
              [t.importDefaultSpecifier(t.identifier('Runtime'))],
              t.stringLiteral('@manta-style/runtime'),
            ),
          );
          path.node.body.unshift(
            t.importDeclaration(
              [t.importDefaultSpecifier(t.identifier('RuntimeHelpers'))],
              t.stringLiteral('@manta-style/flowtype-helpers'),
            ),
          );
        },
        TypeAlias(path) {
          // type T = ...
          const { node } = path;
          path.replaceWith(
            t.variableDeclaration('const', [
              t.variableDeclarator(
                node.id,
                /*
                 runtime.TypeAliasDeclaration(function(factory) { 
                   // see below
                 }, []);
                 */
                createRuntimeFunctionCall('TypeAliasDeclaration', [
                  t.stringLiteral(node.id.name),
                  t.functionExpression(
                    null,
                    [t.identifier('typeFactory')],
                    t.blockStatement([
                      ...(node.typeParameters
                        ? node.typeParameters.params.map((param) =>
                            // const T = typeFactory.TypeParameter(\\"T\\", boundType);
                            t.variableDeclaration('const', [
                              t.variableDeclarator(
                                // @ts-ignore
                                t.identifier(param.name),
                                t.callExpression(
                                  t.memberExpression(
                                    t.identifier('typeFactory'),
                                    t.identifier('TypeParameter'),
                                  ),
                                  [
                                    // @ts-ignore
                                    t.stringLiteral(param.name),
                                    ...(param.bound
                                      ? [
                                          transformLiteral(
                                            param.bound.typeAnnotation,
                                          ),
                                        ]
                                      : []),
                                  ],
                                ),
                              ),
                            ]),
                          )
                        : []),
                      /*
                      var type = ...;
                      return type;
                      */
                      t.variableDeclaration('const', [
                        t.variableDeclarator(
                          t.identifier('type'),
                          transformLiteral(node.right),
                        ),
                      ]),
                      t.returnStatement(t.identifier('type')),
                    ]),
                  ),
                  generateJSDocAnnotations(node.leadingComments),
                ]),
              ),
            ]),
          );
          path.skip();
        },
      });

      // transpile
      const transformedCode = babelGenerate(ast).code;
      const transpiledAst = Babel.transformSync(transformedCode, {
        presets: [require('@babel/preset-env')],
      });
      if (transpiledAst && transpiledAst.code) {
        return transpiledAst.code;
      }
    }
    return '';
  };
}

function createRuntimeFunctionCall(methodName: string, argArray: any[]) {
  return t.callExpression(
    t.memberExpression(t.identifier('Runtime'), t.identifier(methodName)),
    argArray,
  );
}

function createRuntimeExpression(propertyName: string) {
  return t.memberExpression(
    t.identifier('Runtime'),
    t.identifier(propertyName),
  );
}

function transformLiteral(node: Babel.types.Node): any {
  switch (node.type) {
    case 'NumberLiteralTypeAnnotation':
      // 123 -> runtime.Literal(123)
      return createRuntimeFunctionCall('Literal', [
        t.numericLiteral(node.value),
      ]);
    case 'BooleanLiteralTypeAnnotation':
      // true -> runtime.Literal(true)
      return createRuntimeFunctionCall('Literal', [
        t.booleanLiteral(node.value),
      ]);
    case 'StringLiteralTypeAnnotation':
      // 'manta' -> runtime.Literal('manta')
      return createRuntimeFunctionCall('Literal', [
        t.stringLiteral(node.value),
      ]);
    case 'TupleTypeAnnotation':
      // [1, 2, 3] -> runtime.TupleType([1, 2, 3])
      return createRuntimeFunctionCall('TupleType', [
        t.arrayExpression(node.types.map(transformLiteral)),
      ]);
    case 'UnionTypeAnnotation':
      return createRuntimeFunctionCall('UnionType', [
        t.arrayExpression(node.types.map(transformLiteral)),
      ]);
    case 'IntersectionTypeAnnotation':
      return createRuntimeFunctionCall('IntersectionType', [
        t.arrayExpression(node.types.map(transformLiteral)),
      ]);
    case 'ObjectTypeAnnotation':
      // runtime.TypeLiteral(typeLiteral => { ... })
      return createRuntimeFunctionCall('TypeLiteral', [
        t.functionExpression(
          null,
          [t.identifier('typeLiteral')],
          t.blockStatement([
            // { key: value } -> typeLiteral.property(...)
            ...node.properties.map((property) => {
              if (property.type === 'ObjectTypeProperty') {
                return t.expressionStatement(
                  t.callExpression(
                    t.memberExpression(
                      t.identifier('typeLiteral'),
                      t.identifier('property'),
                    ),
                    [
                      property.key.type === 'Identifier'
                        ? t.stringLiteral(property.key.name)
                        : property.key,
                      transformLiteral(property.value),
                      t.booleanLiteral(!!property.optional),
                      generateJSDocAnnotations(property.leadingComments),
                    ],
                  ),
                );
              } else {
                // TODO: spread property
                return t.emptyStatement();
              }
            }),
            // { [key: type]: value } -> typeLiteral.computedProperty(...)
            ...(node.indexers
              ? node.indexers.map((indexer) => {
                  return t.expressionStatement(
                    t.callExpression(
                      t.memberExpression(
                        t.identifier('typeLiteral'),
                        t.identifier('computedProperty'),
                      ),
                      [
                        t.stringLiteral(indexer.id ? indexer.id.name : 'key'),
                        transformLiteral(indexer.key),
                        transformLiteral(indexer.value),
                        t.numericLiteral(0), // ComputedPropertyOperator.INDEX_SIGNATURE
                        t.booleanLiteral(false),
                        generateJSDocAnnotations(indexer.leadingComments),
                      ],
                    ),
                  );
                })
              : []),
          ]),
        ),
      ]);
    case 'NullableTypeAnnotation':
      // ?T -> runtime.NullableType(T)
      return createRuntimeFunctionCall('NullableType', [
        transformLiteral(node.typeAnnotation),
      ]);
    case 'ArrayTypeAnnotation':
      // T[] -> runtime.ArrayType(T)
      return createRuntimeFunctionCall('ArrayType', [
        transformLiteral(node.elementType),
      ]);
    case 'NumberTypeAnnotation':
      // runtime.NumberKeyword
      return createRuntimeExpression('NumberKeyword');
    case 'AnyTypeAnnotation':
      // runtime.AnyKeyword
      return createRuntimeExpression('AnyKeyword');
    case 'StringTypeAnnotation':
      // runtime.StringKeyword
      return createRuntimeExpression('StringKeyword');
    case 'BooleanTypeAnnotation':
      // runtime.BooleanKeyword
      return createRuntimeExpression('BooleanKeyword');
    case 'NullLiteralTypeAnnotation':
      // runtime.NullKeyword
      return createRuntimeExpression('NullKeyword');
    case 'EmptyTypeAnnotation':
      // runtime.NeverKeyword
      return createRuntimeExpression('NeverKeyword');
    case 'VoidTypeAnnotation':
      // runtime.UndefinedKeyword
      return createRuntimeExpression('UndefinedKeyword');
    case 'ExistsTypeAnnotation':
      return createRuntimeExpression('ExistentialKeyword');
    case 'GenericTypeAnnotation':
      return (
        handleSpecialGenericType(node) ||
        (node.typeParameters
          ? // A<S, T> -> A.argumentTypes([S,T])
            t.callExpression(
              t.memberExpression(
                runtimeHelperName(node.id),
                t.identifier('argumentTypes'),
              ),
              [
                t.arrayExpression(
                  node.typeParameters.params.map(transformLiteral),
                ),
              ],
            )
          : // A -> A
            runtimeHelperName(node.id))
      );
    default:
      console.log(node.type, 'Not Implemented');
      return undefined;
  }
}

function handleSpecialGenericType(node: Babel.types.GenericTypeAnnotation) {
  switch (node.id.name) {
    case 'Object':
      return createRuntimeExpression('ObjectKeyword');
    case 'undefined':
      return createRuntimeExpression('UndefinedKeyword');
  }
}

function runtimeHelperName(id: Babel.types.Identifier) {
  if (helperTypes.indexOf(id.name) > -1) {
    return t.memberExpression(t.identifier('RuntimeHelpers'), id);
  }
  return id;
}

function firstParam(node: Babel.types.GenericTypeAnnotation) {
  // @ts-ignore
  return node.typeParameters.params[0];
}

function secondParam(node: Babel.types.GenericTypeAnnotation) {
  // @ts-ignore
  return node.typeParameters.params[1];
}

function generateJSDocAnnotations(
  comments: ReadonlyArray<Babel.types.Comment> | null,
) {
  return t.arrayExpression();
}
