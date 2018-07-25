import { Type } from "./baseType";

export class ErrorType extends Type {
  private message: string;
  constructor(errorMessage: string) {
    super();
    this.message = errorMessage;
  }
  public deriveLiteralType() {
    return this;
  }
  public mock() {
    throw new Error(this.message);
  }
}
