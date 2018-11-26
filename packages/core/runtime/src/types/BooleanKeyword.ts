import Literal from './Literal';
import { Type, Annotation, MantaStyleContext } from '@manta-style/core';

export default class BooleanKeyword extends Type {
  public async deriveLiteral(
    annotations: Annotation[],
    context: MantaStyleContext,
  ) {
    const { plugins } = context;
    const pluginValue = await plugins.getMockValueFromPlugin(
      'BooleanType',
      (plugin) => plugin(annotations, context),
    );

    return new Literal(
      typeof pluginValue === 'boolean' ? pluginValue : Math.random() >= 0.5,
    );
  }
  public async validate(value: unknown) {
    return typeof value === 'boolean';
  }
}
