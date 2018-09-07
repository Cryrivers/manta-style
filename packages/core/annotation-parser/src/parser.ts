import { parse } from 'handlebars';

type AnnotationLiteral = {
  type: 'literal';
  value: string | number | boolean | undefined | null;
};

type AnnotationExpression = {
  type: 'expression';
  name: string;
  params: Array<AnnotationNode>;
  hash: { [name: string]: AnnotationNode };
};

type AnnotationNode = AnnotationLiteral | AnnotationExpression | undefined;

export type AnnotationAst = AnnotationNode;

export function parseAnnotationFromString(
  handlebarString: string,
): AnnotationAst {
  const mustacheStatement = parse(handlebarString).body[0];
  return simplifyAst(mustacheStatement);
}

function simplifyAst(statement: hbs.AST.Expression | null): AnnotationNode {
  if (!statement) {
    return undefined;
  }
  switch (statement.type) {
    case 'MustacheStatement':
    case 'SubExpression': {
      // @ts-ignore
      const fnName: string = statement.path.original;
      const params: Array<AnnotationNode> = [];
      const hash: { [name: string]: AnnotationNode } = {};
      // @ts-ignore
      for (const param of statement.params) {
        params.push(simplifyAst(param));
      }
      // @ts-ignore
      if (statement.hash) {
        // @ts-ignore
        for (const hashPair of statement.hash.pairs) {
          // @ts-ignore
          hash[hashPair.key] = simplifyAst(hashPair.value);
        }
      }
      return {
        type: 'expression',
        name: fnName,
        params,
        hash,
      };
    }
    case 'PathExpression':
      return {
        type: 'expression',
        // @ts-ignore
        name: statement.original,
        params: [],
        hash: {},
      };
    case 'StringLiteral':
    case 'BooleanLiteral':
    case 'NumberLiteral':
      return {
        type: 'literal',
        // @ts-ignore
        value: statement.value,
      };
    case 'UndefinedLiteral':
      return {
        type: 'literal',
        value: undefined,
      };
    case 'NullLiteral':
      return {
        type: 'literal',
        value: null,
      };
  }
  return undefined;
}
