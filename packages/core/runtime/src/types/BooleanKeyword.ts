import Literal from './Literal';
import { Type, Annotation, MantaStyleContext } from '@manta-style/core';

export default class BooleanKeyword extends Type {
  public deriveLiteral(annotations: Annotation[], context: MantaStyleContext) {
    const { plugins } = context;
    const pluginValue = plugins.getMockValueFromPlugin(
      'BooleanType',
      (plugin) => plugin(annotations, context),
    );

    return new Literal(
      typeof pluginValue === 'boolean' ? pluginValue : Math.random() >= 0.5,
    );
  }
  public validate(value: unknown): value is any {
    return typeof value === 'boolean';
  }
}
