import Literal from './Literal';
import { Annotation, usePluginSystem, Type } from '@manta-style/core';
import { throwUnableToFormat } from '../utils/errorReporting';

export default class NumberKeyword extends Type {
  public deriveLiteral(annotations: Annotation[]) {
    const [plugins] = usePluginSystem();

    const pluginValue = plugins.getMockValueFromPlugin('NumberType', (plugin) =>
      plugin(annotations),
    );
    const numberValue =
      pluginValue !== null ? pluginValue : Math.random() * 100;
    return new Literal(numberValue);
  }
  public validate(value: unknown): value is number {
    return typeof value === 'number';
  }
  public format(value: unknown) {
    if (typeof value === 'number') {
      return value;
    } else if (typeof value === 'string' && !isNaN(Number(value))) {
      return Number(value);
    }
    throwUnableToFormat({ typeName: 'NumberKeyword', inputValue: value });
  }
}
