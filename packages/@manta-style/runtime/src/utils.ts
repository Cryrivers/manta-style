import { max, min, round } from "lodash-es";

export abstract class Type {
  public neverType: boolean = false;
  // abstract assignable(type: Type): boolean;
  abstract mock(annotations?: Annotation[]): any;
  abstract validate(input: any): boolean;
}

export function getAnnotationsByKey(
  key: string,
  annotations?: Annotation[]
): string[] {
  return annotations
    ? annotations.filter(item => item.key === key).map(item => item.value)
    : [];
}

export type Annotation = {
  key: string;
  value: string;
};

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

export function getNumberFromAnnotationKey({
  key,
  precision = 2,
  startFromZero = true,
  annotations
}: {
  key: string;
  precision?: number;
  startFromZero?: boolean;
  annotations?: Annotation[];
}): number | undefined {
  const values = getAnnotationsByKey(key, annotations).map(item =>
    parseFloat(item)
  );
  if (values.length > 0) {
    const maxValue = max(values);
    const minValueFromArray = min(values);
    const minValue = startFromZero
      ? minValueFromArray === maxValue
        ? 0
        : minValueFromArray
      : minValueFromArray;
    if (typeof minValue !== "undefined" && typeof maxValue !== "undefined") {
      return round(Math.random() * (maxValue - minValue) + minValue, precision);
    }
  }
}
