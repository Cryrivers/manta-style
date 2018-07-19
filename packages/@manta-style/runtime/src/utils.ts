export abstract class Type {
  public neverType: boolean = false;
  public ref(_types: Type[]): Type {
    return this;
  }
  // abstract extends(type: Type): boolean;
  abstract mock(): any;
  abstract validate(input: any): boolean;
}

export type Property = {
  name: string;
  type: Type;
  questionMark: boolean;
};

export type AnyObject = {
  [key: string]: any;
};

export type Literals = string | boolean | number;

export class ErrorType extends Type {
  private errorMessage: string;
  constructor(errorMessage: string) {
    super();
    this.errorMessage = errorMessage;
  }
  public mock() {
    throw new Error(this.errorMessage);
  }
  public validate(): never {
    throw new Error(this.errorMessage);
  }
}
