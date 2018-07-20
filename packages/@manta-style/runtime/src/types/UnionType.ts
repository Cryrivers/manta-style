import { Type } from "../utils";

export default class UnionType extends Type {
  private unionTypes: Type[] = [];
  constructor(types: Type[]) {
    super();
    this.unionTypes = types;
  }
  public mock() {
    const chosenType = this.unionTypes[
      Math.floor(Math.random() * this.unionTypes.length)
    ];
    // FIXME: never type could be accidentally called.
    return chosenType.mock();
  }
  public validate(input: any) {
    return this.unionTypes.some(type => type.validate(input));
  }
}
