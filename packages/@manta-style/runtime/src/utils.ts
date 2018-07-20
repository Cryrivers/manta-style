export abstract class Type {
  public neverType: boolean = false;
  // abstract assignable(type: Type): boolean;
  abstract mock(): any;
  abstract validate(input: any): boolean;
}

export type Property = {
  name: string;
  type: Type;
  questionMark: boolean;
};

export const enum ComputedPropertyOperator {
  INDEX_SIGNATURE,
  IN_KEYWORD
}

export type ComputedProperty = Property & {
  keyType: Type;
  operator: ComputedPropertyOperator;
};

export type AnyObject = {
  [key: string]: any;
};

export type Literals = string | boolean | number;

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
