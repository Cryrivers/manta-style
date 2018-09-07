import { MantaStyleAnnotation } from './annotation';
import { AnnotationAst } from '@manta-style/annotation-parser';
import { PluginSystem } from './plugin';
import { Annotation } from './utils/annotation';

export type MantaStyleContext = {
  query: { [key: string]: unknown };
  plugins: PluginSystem;
};
export * from './plugin';
export { MantaStyleAnnotation, AnnotationAst, Annotation };

export abstract class Type {
  abstract deriveLiteral(
    parentAnnotations: MantaStyleAnnotation,
    context: MantaStyleContext,
  ): Promise<Type>;
  public mock(): any {
    throw new Error('Literal types should be derived before mock.');
  }
}
