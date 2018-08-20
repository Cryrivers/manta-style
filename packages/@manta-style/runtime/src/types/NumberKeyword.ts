import { Type, Annotation } from '../utils/baseType';
import Literal from './Literal';
import MantaStyle from '..';

function getNumberLiteral(annotations: Annotation[], self: NumberKeyword) {
  const { plugins } = MantaStyle.context;
  // @ts-ignore
  const pluginValue = plugins.getMockValueFromPlugin(
    'NumberType',
    self,
    annotations,
  );
  if (pluginValue !== null) {
    return Number(pluginValue);
  }
  return Math.random() * 100;
}

export default class NumberKeyword extends Type {
  public deriveLiteral(annotations: Annotation[]) {
    return new Literal(getNumberLiteral(annotations, this));
  }
}
