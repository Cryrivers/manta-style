import { Type } from "../utils/baseType";
import { sample } from "lodash-es";
import NeverKeyword from "./NeverKeyword";

export default class UnionType extends Type {
  private types: Type[] = [];
  constructor(types: Type[]) {
    super();
    this.types = types.filter(type => !(type instanceof NeverKeyword));
  }
  public deriveLiteral() {
    const derivedTypes = this.types.map(type => type.deriveLiteral());
    return new UnionType(derivedTypes);
  }
  public mock() {
    const chosenType = sample(this.types);
    if (chosenType) {
      return chosenType.mock();
    }
    throw Error("Something bad happens :(");
  }
  public getTypes(): Type[] {
    return this.types;
  }
}
