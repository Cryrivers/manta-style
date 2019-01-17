import { Type } from '@manta-style/core';
import { throwUnableToFormat } from '../utils/errorReporting';

export default class NullKeyword extends Type {
  public deriveLiteral() {
    return this;
  }
  public mock() {
    return null;
  }
  public validate(value: unknown): value is null {
    return value === null;
  }
  public format(value: unknown) {
    if ([null, 0, ''].includes(value as null)) {
      return null;
    }
    throwUnableToFormat({
      typeName: 'NullKeyword',
      inputValue: value,
      expectedValue: [null, 0, ''],
    });
  }
}
