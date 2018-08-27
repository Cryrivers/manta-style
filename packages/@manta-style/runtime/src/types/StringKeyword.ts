import { Type, Annotation } from '../utils/baseType';
import Literal from './Literal';
import MantaStyle from '..';

const DEFAULT_STATIC_STRING =
  'This is a string message. Customize it with JSDoc tag @example';

async function getStringLiteral(
  annotations: Annotation[],
  self: StringKeyword,
) {
  const { plugins } = MantaStyle.context;
  // @ts-ignore
  const pluginValue = await plugins.getMockValueFromPlugin(
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
  public async deriveLiteral(annotations: Annotation[]) {
    return new Literal(await getStringLiteral(annotations, this));
  }
}
