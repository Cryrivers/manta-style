import Literal from './Literal';
import { annotationUtils, MantaStyleContext, Type } from '@manta-style/core';

export default class NumberKeyword extends Type {
  public async deriveLiteral(
    annotations: annotationUtils.MantaStyleAnnotation,
    context: MantaStyleContext,
  ) {
    const { plugins } = context;

    const pluginValue = await plugins.getMockValueFromPlugin(
      'NumberType',
      (plugin: any) => annotations.execute(plugin),
    );
    const numberValue =
      pluginValue !== null ? Number(pluginValue) : Math.random() * 100;
    return new Literal(numberValue);
  }
}
