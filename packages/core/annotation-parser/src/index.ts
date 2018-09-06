import { parse } from 'handlebars';

type Plugins = {
  [key: string]: { name: string; mock: Function };
};

export class MantaStyleAnnotation {
  static parseFromString(handlebarString: string) {
    const mustacheStatement = parse(handlebarString).body[0];
    return new MantaStyleAnnotation(mustacheStatement);
  }

  static empty() {
    return new MantaStyleAnnotation(null);
  }

  static JsdocKey = 'mantastyle';

  private mustacheStatement: hbs.AST.Expression | null;
  constructor(mustacheStatement: hbs.AST.Expression | null) {
    this.mustacheStatement = mustacheStatement;
  }

  public execute(plugins: Plugins) {
    return execute(plugins, this.mustacheStatement);
  }

  public inherit(parentAnnotation: MantaStyleAnnotation): MantaStyleAnnotation {
    if (this.mustacheStatement != null) {
      return this;
    }
    return parentAnnotation;
  }
}

async function execute(
  plugins: Plugins,
  statement: hbs.AST.Expression | null,
): Promise<any> {
  if (!statement) {
    return null;
  }
  switch (statement.type) {
    case 'MustacheStatement':
    case 'SubExpression': {
      // @ts-ignore
      const fnName = statement.path.original;
      const plugin = plugins[fnName];
      if (!plugin) {
        throw new Error(`@manta-style Plugin "${fnName}" not found`);
      }
      const params = [];
      const hash = {};
      // @ts-ignore
      for (const param of statement.params) {
        params.push(await execute(plugins, param));
      }
      // @ts-ignore
      if (statement.hash) {
        // @ts-ignore
        for (const hashPair of statement.hash.pairs) {
          // @ts-ignore
          hash[hashPair.key] = await execute(plugins, hashPair.value);
        }
      }
      if (Object.keys(hash).length > 0) {
        // only add hash if hash is not empty
        params.push(hash);
      }
      // @ts-ignore
      return await plugin(...params);
    }
    case 'StringLiteral':
    case 'BooleanLiteral':
    case 'NumberLiteral':
      // @ts-ignore
      return statement.value;
    case 'UndefinedLiteral':
      return undefined;
    case 'NullLiteral':
      return null;
  }
  return null;
}
