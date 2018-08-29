import { max, min, round } from 'lodash-es';

type AnyObject = { [key: string]: any };
type MockResult<T> = T | null | Promise<T | null>;

export type MockPlugin = {
  name: string;
  mock: {
    StringType?: (
      annotations: Annotation[],
    ) => MockResult<string>;
    NumberType?: (
      annotations: Annotation[],
    ) => MockResult<number>;
    BooleanType?: (
      annotations: Annotation[],
    ) => MockResult<boolean>;
    TypeLiteral?: (
      annotations: Annotation[],
    ) => MockResult<AnyObject>;
  };
};

export type Annotation = {
  key: string;
  value: string;
};

export class annotationUtils {
  public static findAnnotation(
    key: string,
    annotations?: Annotation[],
  ): Annotation | undefined {
    return annotations && annotations.find((item) => item.key === key);
  }

  public static getAnnotationsByKey(
    key: string,
    annotations?: Annotation[],
  ): string[] {
    return annotations
      ? annotations.filter((item) => item.key === key).map((item) => item.value)
      : [];
  }

  public static getNumberFromAnnotationKey({
    key,
    precision,
    annotations,
  }: {
    key: string;
    precision: number;
    annotations?: Annotation[];
  }): number | undefined {
    const values = annotationUtils
      .getAnnotationsByKey(key, annotations)
      .map((item) => parseFloat(item));
    if (values.length > 0) {
      const maxValue = max(values);
      const minValue = min(values);
      if (typeof minValue !== 'undefined' && typeof maxValue !== 'undefined') {
        return round(
          Math.random() * (maxValue - minValue) + minValue,
          precision,
        );
      }
    }
  }

  public static inheritAnnotations(parent: Annotation[], child: Annotation[]) {
    const childKeys = child.map((item) => item.key);
    const filteredParent = parent.filter(
      (item) => !childKeys.includes(item.key),
    );
    return [...filteredParent, ...child];
  }
}
