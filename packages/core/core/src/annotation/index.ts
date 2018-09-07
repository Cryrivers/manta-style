import { AnnotationAst } from '@manta-style/annotation-parser';

type Plugins = {
  [key: string]: { name: string; mock: Function };
};

export class MantaStyleAnnotation {
  static empty() {
    return new MantaStyleAnnotation(undefined);
  }

  private annotation: AnnotationAst;
  constructor(annotation: AnnotationAst) {
    this.annotation = annotation;
  }

  public execute(plugins: Plugins) {
    return execute(plugins, this.annotation);
  }

  public inherit(parentAnnotation: MantaStyleAnnotation): MantaStyleAnnotation {
    if (this.annotation != null) {
      return this;
    }
    return parentAnnotation;
  }
}

async function execute(
  plugins: Plugins,
  statement: AnnotationAst,
): Promise<any> {
  if (!statement) {
    return null;
  }
  switch (statement.type) {
    case 'literal':
      return statement.value;
    case 'expression': {
      // TODO: LAZY Plugin?
      const lazy = false;
      const plugin = plugins[statement.name];
      if (!plugin) {
        throw new Error(`@manta-style Plugin "${statement.name}" not found`);
      }
      if (!lazy) {
        const params = [];
        const hash: { [key: string]: any } = {};
        for (const param of statement.params) {
          params.push(await execute(plugins, param));
        }
        for (const h in statement.hash) {
          hash[h] = await execute(plugins, statement.hash[h]);
        }
        if (Object.keys(hash).length > 0) {
          // only add hash if hash is not empty
          params.push(hash);
        }

        return await plugin.mock(...params);
      }
    }
    default:
      return null;
  }
}
