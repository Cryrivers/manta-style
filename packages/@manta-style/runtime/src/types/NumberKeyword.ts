import { Type, Annotation } from '../utils/baseType';
import Literal from './Literal';
// import MantaStyle from '..';

async function getNumberLiteral(
  annotations: Annotation[],
  self: NumberKeyword,
) {
  // const { plugins } = MantaStyle.context;
  // // @ts-ignore
  // const pluginValue = await plugins.getMockValueFromPlugin(
  //   'NumberType',
  //   self,
  //   annotations,
  // );
  // if (pluginValue !== null) {
  //   return Number(pluginValue);
  // }
  return Math.random() * 100;
}

export default class NumberKeyword extends Type {
  public async deriveLiteral(annotations: Annotation[]) {
    return new Literal(await getNumberLiteral(annotations, this));
  }
}
