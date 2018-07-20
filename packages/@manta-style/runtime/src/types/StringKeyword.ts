import { Type } from "../utils";
import * as faker from 'faker';

/**
 * @example Test
 * @example Hehee
 */
export default class StringKeyword extends Type {
  public mock() {
    return faker.name.findName();
  }
  public validate(input: any) {
    return typeof input === "string";
  }
}
