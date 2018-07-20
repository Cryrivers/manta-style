import { Type } from "../utils";
import * as faker from 'faker';

/**
 * @example Test
 * @example Hehee
 */
export default class StringKeyword extends Type {
  public mock() {
    // see if there's @example
    const examples = this.getAnnotationByKey('example');
    if (examples.length > 0) {
      return examples[0];
    } else {
      return 'This is a string message. Use @example or @faker to customize.'
    }
  }
  public validate(input: any) {
    return typeof input === "string";
  }
}
