import Literal from './Literal';
import { Annotation, MantaStyleContext, Type } from '@manta-style/core';

export default class NumberKeyword extends Type {
  public deriveLiteral(annotations: Annotation[], context: MantaStyleContext) {
    const { plugins } = context;

    const pluginValue = plugins.getMockValueFromPlugin('NumberType', (plugin) =>
      plugin(annotations, context),
    );
    const numberValue =
      pluginValue !== null ? Number(pluginValue) : Math.random() * 100;
    return new Literal(numberValue);
  }
  public validate(value: unknown): value is number {
    return typeof value === 'number';
  }
}
