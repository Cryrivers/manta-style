import Literal from './Literal';
import {
  MantaStyleAnnotation,
  MantaStyleContext,
  Type,
} from '@manta-style/core';

export default class NumberKeyword extends Type {
  public async deriveLiteral(
    annotations: MantaStyleAnnotation,
    context: MantaStyleContext,
  ) {
    const pluginValue = await annotations.execute(
      context.plugins.getPluginForNode('NumberType'),
    );
    const numberValue =
      pluginValue !== null ? Number(pluginValue) : Math.random() * 100;
    return new Literal(numberValue);
  }
}
