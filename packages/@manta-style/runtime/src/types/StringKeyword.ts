import { sample } from "lodash-es";
import * as faker from "faker";
import { getAnnotationsByKey } from "../utils/annotation";
import { Type, Annotation } from "../utils/baseType";
import Literal from "./Literal";

const DEFAULT_STATIC_STRING =
  "This is a string message. Customize it with JSDoc tag @example";

function getStringLiteral(annotations?: Annotation[]) {
  const jsdocExample = getAnnotationsByKey("example", annotations);
  if (jsdocExample.length > 0) {
    return faker.fake(sample(jsdocExample) || DEFAULT_STATIC_STRING);
  } else {
    return DEFAULT_STATIC_STRING;
  }
}

export default class StringKeyword extends Type {
  public deriveLiteralType(annotations?: Annotation[]) {
    return new Literal(getStringLiteral(annotations));
  }
}
