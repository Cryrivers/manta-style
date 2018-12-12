import { Type } from '@manta-style/core';

export class ErrorType extends Type {
  private readonly message: string;
  constructor(errorMessage: string) {
    super();
    this.message = errorMessage;
  }
  public deriveLiteral() {
    return this;
  }
  public validate(value: any): value is never {
    throw Error('ErrorType does not support `validate` method.');
  }
  public format(vaue: unknown) {
    throw Error('ErrorType does not support `format` method.');
  }
  public mock() {
    throw new Error(this.message);
  }
}
