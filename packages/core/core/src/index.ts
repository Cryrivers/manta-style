import * as annotationUtils from './utils/annotation';
import { PluginSystem } from './plugin';
import { Annotation } from './utils/annotation';

export type MantaStyleContext = {
  query: { [key: string]: unknown };
  param: { [key: string]: unknown };
  plugins: PluginSystem;
};
export * from './plugin';
export { annotationUtils, Annotation };

export abstract class Type {
  public abstract deriveLiteral(
    parentAnnotations: Annotation[],
    context: MantaStyleContext,
  ): Promise<Type>;
  public mock(): any {
    throw new Error('Literal types should be derived before mock.');
  }
}

export abstract class CustomType extends Type {
  public abstract typeForAssignabilityTest(
    parentAnnotations: Annotation[],
    context: MantaStyleContext,
  ): Promise<Type>;
}
