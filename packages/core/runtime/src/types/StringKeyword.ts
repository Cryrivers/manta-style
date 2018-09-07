import Literal from './Literal';
import {
  MantaStyleAnnotation,
  MantaStyleContext,
  Type,
} from '@manta-style/core';

const DEFAULT_STATIC_STRING =
  'This is a string message. Customize it with JSDoc tag @example';

export default class StringKeyword extends Type {
  public async deriveLiteral(
    annotations: MantaStyleAnnotation,
    context: MantaStyleContext,
  ) {
    const pluginValue = await annotations.execute(
      context.plugins.getPluginForNode('StringType'),
    );
    let stringValue =
      pluginValue !== null ? String(pluginValue) : DEFAULT_STATIC_STRING;
    return new Literal(stringValue);
  }
}
