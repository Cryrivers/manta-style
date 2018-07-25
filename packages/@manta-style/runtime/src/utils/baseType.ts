export type Annotation = {
  key: string;
  value: string;
};

export abstract class Type {
  public neverType: boolean = false;
  abstract deriveLiteralType(annotations?: Annotation[]): Type;
  public mock(): any {
    throw new Error("Literal types should be derived before mock.");
  }
}

export type Property = {
  name: string;
  type: Type;
  questionMark: boolean;
  annotations: Annotation[];
};

export const enum ComputedPropertyOperator {
  INDEX_SIGNATURE = 0,
  IN_KEYWORD = 1
}

export type ComputedProperty = Property & {
  keyType: Type;
  operator: ComputedPropertyOperator;
};

export type AnyObject = {
  [key: string]: any;
};

export type Literals = string | boolean | number;
