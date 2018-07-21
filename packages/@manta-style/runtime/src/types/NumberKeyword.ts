import { Type, getAnnotationsByKey, Annotation } from "../utils";
import { min, max, round } from "lodash-es";
export default class NumberKeyword extends Type {
  public mock(annotations?: Annotation[]) {
    const jsdocExample = getAnnotationsByKey("example", annotations).map(item =>
      parseFloat(item)
    );
    // TODO: Support @integer and @precision 3
    let precision = 2;
    if (jsdocExample.length > 0) {
      const maxValue = max(jsdocExample);
      let minValue = min(jsdocExample);
      minValue = minValue === maxValue ? 0 : minValue;
      if (typeof minValue !== "undefined" && typeof maxValue !== "undefined") {
        return round(Math.random() * (maxValue - minValue) + minValue, precision);
      }
    }
    return round(Math.random() * 100, precision);
  }
  public validate(input: any) {
    return typeof input === "number";
  }
}
