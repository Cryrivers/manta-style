import Literal from './Literal';
import { Type, Annotation, usePluginSystem } from '@manta-style/core';
import { Literals } from '../utils/baseType';

export default class BooleanKeyword extends Type {
  public deriveLiteral(annotations: Annotation[]) {
    const [plugins] = usePluginSystem();
    const pluginValue = plugins.getMockValueFromPlugin(
      'BooleanType',
      (plugin) => plugin(annotations),
    );

    return new Literal(
      typeof pluginValue === 'boolean' ? pluginValue : Math.random() >= 0.5,
    );
  }
  public validate(value: unknown): value is any {
    return typeof value === 'boolean';
  }
  public format(value: unknown) {
    if ([1, true].includes(value as number)) {
      return true;
    } else if ([0, false, ''].includes(value as Literals)) {
      return false;
    }
    throw new Error('Cannot format as the value cannot be validated.');
  }
}
