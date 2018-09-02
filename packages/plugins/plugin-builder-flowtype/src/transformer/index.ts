import * as Babel from '@babel/core';
import babelGenerate from '@babel/generator';

const { types: t } = Babel;
export function createTransformer(importHelpers: boolean) {
  return function(code: string) {
    const ast = Babel.parse(code, {
      sourceType: 'module',
      plugins: [
        '@babel/plugin-syntax-object-rest-spread',
        '@babel/plugin-syntax-flow',
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
                      t.arrayExpression(),
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
                return createRuntimeFunctionCall('Literal', [
                  t.numericLiteral(node.value),
                ]);
              case 'BooleanLiteralTypeAnnotation':
                return createRuntimeFunctionCall('Literal', [
                  t.booleanLiteral(node.value),
                ]);
              case 'StringLiteralTypeAnnotation':
                return createRuntimeFunctionCall('Literal', [
                  t.stringLiteral(node.value),
                ]);
              case 'TupleTypeAnnotation':
                return createRuntimeFunctionCall('TupleType', [
                  t.arrayExpression(node.types.map(transformLiteral)),
                ]);
              case 'UnionTypeAnnotation':
                return createRuntimeFunctionCall('UnionType', [
                  t.arrayExpression(node.types.map(transformLiteral)),
                ]);
              case 'IntersectionTypeAnnotation':
                return createRuntimeFunctionCall('UnionType', [
                  t.arrayExpression(node.types.map(transformLiteral)),
                ]);
              case 'ObjectTypeAnnotation':
                return createRuntimeFunctionCall('TypeLiteral', [
                  t.functionExpression(
                    null,
                    [t.identifier('typeLiteral')],
                    t.blockStatement(
                      node.properties.map((property) => {
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
                                // TODO:
                                t.arrayExpression(),
                              ],
                            ),
                          );
                        } else {
                          // TODO: spread property
                          return t.emptyStatement();
                        }
                      }),
                    ),
                  ),
                ]);
              case 'NullableTypeAnnotation':
                return createRuntimeFunctionCall('OptionalType', [
                  transformLiteral(node.typeAnnotation),
                ]);
              case 'ArrayTypeAnnotation':
                return createRuntimeFunctionCall('ArrayType', [
                  transformLiteral(node.elementType),
                ]);
              case 'NumberTypeAnnotation':
                return createRuntimeExpression('NumberKeyword');
              case 'AnyTypeAnnotation':
                return createRuntimeExpression('AnyKeyword');
              case 'StringTypeAnnotation':
                return createRuntimeExpression('StringKeyword');
              case 'BooleanTypeAnnotation':
                return createRuntimeExpression('BooleanKeyword');
              case 'NullLiteralTypeAnnotation':
                return createRuntimeExpression('NullKeyword');
              case 'VoidTypeAnnotation':
                return createRuntimeExpression('NeverKeyword');
              case 'GenericTypeAnnotation':
                return (
                  handleSpecialGenericType(node) ||
                  (node.typeParameters
                    ? t.callExpression(
                        t.memberExpression(
                          node.id,
                          t.identifier('argumentTypes'),
                        ),
                        node.typeParameters.params.map(transformLiteral),
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
              case 'undefined':
                return createRuntimeExpression('UndefinedKeyword');
            }
          }
        },
      });

      return babelGenerate(ast).code;
    }
    return '';
  };
}
