export abstract class Type {
  protected annotations: Annotation[] = [];
  public neverType: boolean = false;
  // abstract assignable(type: Type): boolean;
  public annotate(annotations: Annotation[]) {
    this.annotations = annotations;
  }
  protected getAnnotationByKey(key: string): string[] {
    return this.annotations.filter(item => item.key === key).map(item => item.value);
  }
  abstract mock(): any;
  abstract validate(input: any): boolean;
}

export type Annotation = {
  key: string,
  value: string
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
