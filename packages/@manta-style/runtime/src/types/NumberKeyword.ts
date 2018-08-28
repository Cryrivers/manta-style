import { Type, Annotation, MantaStyleContext } from '../utils/baseType';
import Literal from './Literal';

export default class NumberKeyword extends Type {
  public async deriveLiteral(
    annotations: Annotation[],
    context: MantaStyleContext,
  ) {
    const { plugins } = context;

    const pluginValue = await plugins.getMockValueFromPlugin(
      'NumberType',
      this,
      annotations,
    );
    const numberValue =
      pluginValue !== null ? Number(pluginValue) : Math.random() * 100;
    return new Literal(numberValue);
  }
}
