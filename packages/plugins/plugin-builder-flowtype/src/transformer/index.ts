import * as Babel from '@babel/core';
import babelGenerate from '@babel/generator';

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
          const runtimeIdentifier = path.scope.generateUidIdentifier('Runtime');
          path.node.body.unshift(
            t.importDeclaration(
              [t.importDefaultSpecifier(runtimeIdentifier)],
              t.stringLiteral('@manta-style/runtime'),
            ),
          );
          path.traverse({
            TypeAlias(path) {
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
            },
          });
          path.stop();

          function createRuntimeFunctionCall(
            methodName: string,
            argArray: any[],
          ) {
            return t.callExpression(
              t.memberExpression(runtimeIdentifier, t.identifier(methodName)),
              argArray,
            );
          }

          function createRuntimeExpression(propertyName: string) {
            return t.memberExpression(
              runtimeIdentifier,
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
                return createRuntimeFunctionCall('TypeLiteral', [
                  t.functionExpression(
                    null,
                    [t.identifier('typeLiteral')],
                    t.blockStatement([
                      // { key: value }
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
                                generateJSDocAnnotations(
                                  property.leadingComments,
                                ),
                              ],
                            ),
                          );
                        } else {
                          // TODO: spread property
                          return t.emptyStatement();
                        }
                      }),
                      // { [key: type]: value }
                      ...(node.indexers
                        ? node.indexers.map((indexer) => {
                            return t.expressionStatement(
                              t.callExpression(
                                t.memberExpression(
                                  t.identifier('typeLiteral'),
                                  t.identifier('computedProperty'),
                                ),
                                [
                                  t.stringLiteral(
                                    indexer.id ? indexer.id.name : 'key',
                                  ),
                                  transformLiteral(indexer.key),
                                  transformLiteral(indexer.value),
                                  t.numericLiteral(0), // ComputedPropertyOperator.INDEX_SIGNATURE
                                  t.booleanLiteral(false),
                                  generateJSDocAnnotations(
                                    indexer.leadingComments,
                                  ),
                                ],
                              ),
                            );
                          })
                        : []),
                    ]),
                  ),
                ]);
              case 'NullableTypeAnnotation':
                // ?T -> runtime.OptionalType(T)
                return createRuntimeFunctionCall('OptionalType', [
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
                    ? t.callExpression(
                        t.memberExpression(
                          node.id,
                          t.identifier('argumentTypes'),
                        ),
                        [
                          t.arrayExpression(
                            node.typeParameters.params.map(transformLiteral),
                          ),
                        ],
                      )
                    : node.id)
                );
              default:
                console.log(node.type);
                return undefined;
            }
          }

          function handleSpecialGenericType(
            node: Babel.types.GenericTypeAnnotation,
          ) {
            switch (node.id.name) {
              case '$Keys':
                // runtime.KeyOfKeyword(...);
                return createRuntimeFunctionCall('KeyOfKeyword', [
                  // @ts-ignore
                  transformLiteral(node.typeParameters.params[0]),
                ]);
              case 'Object':
                return createRuntimeExpression('ObjectKeyword');
              case 'Array': {
                // transform Array<T> to T[] and do `transformLiteral`
                const elementType = node.typeParameters
                  ? node.typeParameters.params[0]
                  : t.anyTypeAnnotation();
                return transformLiteral(t.arrayTypeAnnotation(elementType));
              }
              case 'undefined':
                return createRuntimeExpression('UndefinedKeyword');
            }
          }
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

function generateJSDocAnnotations(
  comments: ReadonlyArray<Babel.types.Comment> | null,
) {
  return t.arrayExpression();
}
