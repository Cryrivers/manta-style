import { Type } from './baseType';

export class ErrorType extends Type {
  private readonly message: string;
  constructor(errorMessage: string) {
    super();
    this.message = errorMessage;
  }
  public async deriveLiteral() {
    return this;
  }
  public mock() {
    throw new Error(this.message);
  }
}
