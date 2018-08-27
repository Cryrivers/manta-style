export type Annotation = {
  key: string;
  value: string;
};

export abstract class Type {
  abstract deriveLiteral(parentAnnotations: Annotation[]): Promise<Type>;
  public mock(): any {
    throw new Error('Literal types should be derived before mock.');
  }
}

export const enum QuestionToken {
  None,
  QuestionToken,
  MinusToken,
}

export type Property = {
  name: string;
  type: Type;
  questionMark: boolean;
  annotations: Annotation[];
};

export const enum ComputedPropertyOperator {
  INDEX_SIGNATURE = 0,
  IN_KEYWORD = 1,
}

export type ComputedProperty = Property & {
  keyType: Type;
  operator: ComputedPropertyOperator;
};

export type AnyObject = {
  [key: string]: any;
};

export type Literals = string | boolean | number;
