import { Type, Annotation } from '../utils/baseType';
import Literal from './Literal';
import MantaStyle from '..';

const DEFAULT_STATIC_STRING =
  'This is a string message. Customize it with JSDoc tag @example';

function getStringLiteral(annotations: Annotation[], self: StringKeyword) {
  const { plugins } = MantaStyle.context;
  // @ts-ignore
  const pluginValue = plugins.getMockValueFromPlugin(
    'StringType',
    self,
    annotations,
  );
  if (pluginValue !== null) {
    return String(pluginValue);
  }
  return DEFAULT_STATIC_STRING;
}

export default class StringKeyword extends Type {
  public deriveLiteral(annotations: Annotation[]) {
    return new Literal(getStringLiteral(annotations, this));
  }
}
