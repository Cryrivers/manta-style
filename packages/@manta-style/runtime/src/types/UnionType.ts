import { Type } from "../utils";
import { sample } from 'lodash-es';

export default class UnionType extends Type {
  private unionTypes: Type[] = [];
  constructor(types: Type[]) {
    super();
    this.unionTypes = types;
  }
  public mock() {
    const chosenType = sample(this.unionTypes);
    // FIXME: never type could be accidentally called.
    return chosenType && chosenType.mock();
  }
  public validate(input: any) {
    return this.unionTypes.some(type => type.validate(input));
  }
}
