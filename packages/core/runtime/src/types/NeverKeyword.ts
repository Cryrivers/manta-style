import { Type } from '@manta-style/core';
import { throwUnableToFormat } from '../utils/errorReporting';

export default class NeverKeyword extends Type {
  public deriveLiteral() {
    return this;
  }
  public validate(value: any): value is never {
    throw new Error('`never` keyword does not support `validate` method.');
  }
  public format(value: unknown) {
    throwUnableToFormat({
      typeName: 'NeverKeyword',
      inputValue: value,
      reason: 'Never type can never be formatted.',
    });
  }
}
