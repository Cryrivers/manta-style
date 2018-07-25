import { round } from "lodash-es";
import * as faker from "faker";
import { Type, Annotation } from "../utils/baseType";
import {
  getNumberFromAnnotationKey,
  findAnnotation
} from "../utils/annotation";
import Literal from "./Literal";

const DEFAULT_PRECISION = 0;

function getPrecision(
  integerAnnotation?: Annotation,
  precisionAnnotation?: Annotation
) {
  if (integerAnnotation) {
    return 0;
  } else if (precisionAnnotation) {
    return parseInt(precisionAnnotation.value, 10);
  }
  return DEFAULT_PRECISION;
}

function getTimestamp(date: Date) {
  return Math.floor(date.getTime() / 1000);
}

function getNumberLiteral(annotations?: Annotation[]) {
  const integerAnnotation = findAnnotation("integer", annotations);
  const precisionAnnotation = findAnnotation("precision", annotations);
  const timestampAnnotation = findAnnotation("timestamp", annotations);
  const precision = getPrecision(integerAnnotation, precisionAnnotation);
  const exampleAnnotations = getNumberFromAnnotationKey({
    key: "example",
    precision,
    annotations
  });
  if (timestampAnnotation) {
    switch (timestampAnnotation.value) {
      case "past":
        return getTimestamp(faker.date.past());
      case "future":
        return getTimestamp(faker.date.future());
      default:
        return getTimestamp(faker.date.recent());
    }
  }
  return typeof exampleAnnotations !== "undefined"
    ? exampleAnnotations
    : round(Math.random() * 100, precision);
}

export default class NumberKeyword extends Type {
  public deriveLiteralType(annotations?: Annotation[]) {
    return new Literal(getNumberLiteral(annotations));
  }
}
