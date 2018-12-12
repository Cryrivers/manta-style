import { Type } from '@manta-style/core';

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
    if ([null, 0, '', 'null', 'NULL'].includes(value as null)) {
      return null;
    }
    throw new Error('Cannot format as the value cannot be validated.');
  }
}
