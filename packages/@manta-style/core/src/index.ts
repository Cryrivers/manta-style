import * as annotationUtils from './utils/annotation';
import { PluginSystem } from './plugin';

export { Annotation } from './utils/annotation';
export type MantaStyleContext = {
  query: { [key: string]: unknown };
  plugins: PluginSystem;
};
export * from './plugin';
export { annotationUtils };
