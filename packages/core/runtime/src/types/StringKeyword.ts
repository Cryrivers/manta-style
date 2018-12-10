import Literal from './Literal';
import { Annotation, MantaStyleContext, Type } from '@manta-style/core';

const DEFAULT_STATIC_STRING =
  'This is a string message. Customize it mock plugins. (https://github.com/Cryrivers/manta-style/blob/master/documentation/Plugins.md)';

export default class StringKeyword extends Type {
  public deriveLiteral(annotations: Annotation[], context: MantaStyleContext) {
    const { plugins } = context;

    const pluginValue = plugins.getMockValueFromPlugin('StringType', (plugin) =>
      plugin(annotations, context),
    );
    let stringValue =
      pluginValue !== null ? String(pluginValue) : DEFAULT_STATIC_STRING;
    return new Literal(stringValue);
  }
  public validate(value: unknown): value is string {
    return typeof value === 'string';
  }
}
