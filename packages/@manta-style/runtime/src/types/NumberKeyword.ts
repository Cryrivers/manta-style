import { Type } from '../utils/baseType';
import Literal from './Literal';
import { Annotation, MantaStyleContext } from '@manta-style/core';

export default class NumberKeyword extends Type {
  public async deriveLiteral(
    annotations: Annotation[],
    context: MantaStyleContext,
  ) {
    const { plugins } = context;

    const pluginValue = await plugins.getMockValueFromPlugin(
      'NumberType',
      (plugin: any) => plugin(annotations, context),
    );
    const numberValue =
      pluginValue !== null ? Number(pluginValue) : Math.random() * 100;
    return new Literal(numberValue);
  }
}
