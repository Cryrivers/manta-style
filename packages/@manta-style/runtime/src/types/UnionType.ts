import { Type } from "../utils/baseType";
import { sample } from "lodash-es";

export default class UnionType extends Type {
  private types: Type[] = [];
  constructor(types: Type[]) {
    super();
    this.types = types;
  }
  public mockAll() {
    // Evalutate every item
    const mockResult: any[] = [];
    this.types.forEach(type => {
      if (!type.neverType) {
        mockResult.push(type.mock());
      }
    });
    return mockResult;
  }
  public mock() {
    const chosenResult = sample(this.mockAll());
    return chosenResult;
  }
  public validate(input: any) {
    return this.types.some(type => type.validate(input));
  }
  public getTypes(): Type[] {
    return this.types;
  }
}
