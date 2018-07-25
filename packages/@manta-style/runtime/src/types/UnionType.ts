import { Type } from "../utils/baseType";
import { sample } from "lodash-es";

export default class UnionType extends Type {
  private types: Type[] = [];
  constructor(types: Type[]) {
    super();
    this.types = types;
  }
  public deriveLiteralType() {
    const derivedTypes = this.types.map(type => type.deriveLiteralType());
    const chosenType = sample(derivedTypes);
    if (chosenType) {
      return chosenType;
    }
    throw new Error("Something bad happens :(");
  }
  public getTypes(): Type[] {
    return this.types;
  }
}
