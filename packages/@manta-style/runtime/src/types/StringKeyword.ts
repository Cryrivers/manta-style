import { Type, Annotation, getAnnotationByKey } from "../utils";
import { sample } from "lodash-es";
import * as faker from "faker";

const DEFAULT_STATIC_STRING =
  "This is a string message. Use @example or @faker to customize.";

export default class StringKeyword extends Type {
  public mock(annotations?: Annotation[]) {
    const jsdocExample = getAnnotationByKey("example", annotations);
    if (jsdocExample.length > 0) {
      return faker.fake(sample(jsdocExample) || DEFAULT_STATIC_STRING);
    } else {
      return DEFAULT_STATIC_STRING;
    }
  }
  public validate(input: any) {
    return typeof input === "string";
  }
}
