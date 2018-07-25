import { Type } from "./baseType";

export class ErrorType extends Type {
  private message: string;
  constructor(errorMessage: string) {
    super();
    this.message = errorMessage;
  }
  public mock() {
    throw new Error(this.message);
  }
  public validate(): never {
    throw new Error(this.message);
  }
}
