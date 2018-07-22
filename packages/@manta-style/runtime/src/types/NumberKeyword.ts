import { Type, Annotation, getNumberFromAnnotationKey } from "../utils";
import { round } from "lodash-es";
export default class NumberKeyword extends Type {
  public mock(annotations?: Annotation[]) {
    // TODO: Support @integer and @precision 3
    const number = getNumberFromAnnotationKey({
      key: "example",
      annotations
    });
    return typeof number !== "undefined"
      ? number
      : round(Math.random() * 100, 2);
  }
  public validate(input: any) {
    return typeof input === "number";
  }
}
