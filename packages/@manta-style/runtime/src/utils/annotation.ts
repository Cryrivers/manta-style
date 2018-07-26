import { Annotation } from './baseType';
import { max, min, round } from 'lodash-es';

export function findAnnotation(
  key: string,
  annotations?: Annotation[],
): Annotation | undefined {
  return annotations && annotations.find((item) => item.key === key);
}

export function getAnnotationsByKey(
  key: string,
  annotations?: Annotation[],
): string[] {
  return annotations
    ? annotations.filter((item) => item.key === key).map((item) => item.value)
    : [];
}

export function getNumberFromAnnotationKey({
  key,
  precision,
  annotations,
}: {
  key: string;
  precision: number;
  annotations?: Annotation[];
}): number | undefined {
  const values = getAnnotationsByKey(key, annotations).map((item) =>
    parseFloat(item),
  );
  if (values.length > 0) {
    const maxValue = max(values);
    const minValue = min(values);
    if (typeof minValue !== 'undefined' && typeof maxValue !== 'undefined') {
      return round(Math.random() * (maxValue - minValue) + minValue, precision);
    }
  }
}
