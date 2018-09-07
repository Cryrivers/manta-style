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
  if (isMustacheStatement(statement) || isSubExpression(statement)) {
    const { path } = statement;
    if (isPathExpression(path)) {
      const fnName: string = path.original;
      const params: Array<AnnotationNode> = [];
      const hash: { [name: string]: AnnotationNode } = {};
      for (const param of statement.params) {
        params.push(simplifyAst(param));
      }
      if (statement.hash) {
        for (const hashPair of statement.hash.pairs) {
          hash[hashPair.key] = simplifyAst(hashPair.value);
        }
      }
      return {
        type: 'expression',
        name: fnName,
        params,
        hash,
      };
    } else {
      throw new Error(
        'MustacheStatement with Literal key instead of PathExpression.',
      );
    }
  } else if (isPathExpression(statement)) {
    return {
      type: 'expression',
      name: statement.original,
      params: [],
      hash: {},
    };
  } else if (
    isStringLiteral(statement) ||
    isBooleanLiteral(statement) ||
    isNumberLiteral(statement)
  ) {
    return {
      type: 'literal',
      value: statement.value,
    };
  } else if (isUndefinedLiteral(statement)) {
    return {
      type: 'literal',
      value: undefined,
    };
  } else if (isNullLiteral(statement)) {
    return {
      type: 'literal',
      value: null,
    };
  }
  return undefined;
}

// TODO: Setup webpack, extract these into a new file
function isMustacheStatement(
  statement: hbs.AST.Expression,
): statement is hbs.AST.MustacheStatement {
  return statement.type === 'MustacheStatement';
}

function isSubExpression(
  statement: hbs.AST.Expression,
): statement is hbs.AST.SubExpression {
  return statement.type === 'SubExpression';
}

function isPathExpression(
  statement: hbs.AST.Expression,
): statement is hbs.AST.PathExpression {
  return statement.type === 'PathExpression';
}

function isStringLiteral(
  statement: hbs.AST.Expression,
): statement is hbs.AST.StringLiteral {
  return statement.type === 'StringLiteral';
}

function isBooleanLiteral(
  statement: hbs.AST.Expression,
): statement is hbs.AST.BooleanLiteral {
  return statement.type === 'BooleanLiteral';
}

function isNumberLiteral(
  statement: hbs.AST.Expression,
): statement is hbs.AST.NumberLiteral {
  return statement.type === 'NumberLiteral';
}

function isUndefinedLiteral(
  statement: hbs.AST.Expression,
): statement is hbs.AST.UndefinedLiteral {
  return statement.type === 'UndefinedLiteral';
}

function isNullLiteral(
  statement: hbs.AST.Expression,
): statement is hbs.AST.NullLiteral {
  return statement.type === 'NullLiteral';
}
