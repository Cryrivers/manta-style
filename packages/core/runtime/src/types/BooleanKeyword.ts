import Literal from './Literal';
import { Type, Annotation, usePluginSystem } from '@manta-style/core';

export default class BooleanKeyword extends Type {
  public deriveLiteral(annotations: Annotation[]) {
    const [plugins] = usePluginSystem();
    const pluginValue = plugins.getMockValueFromPlugin(
      'BooleanType',
      (plugin) => plugin(annotations),
    );

    return new Literal(
      typeof pluginValue === 'boolean' ? pluginValue : Math.random() >= 0.5,
    );
  }
  public validate(value: unknown): value is any {
    return typeof value === 'boolean';
  }
}
