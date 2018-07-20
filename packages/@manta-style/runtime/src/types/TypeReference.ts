import { Type } from "../utils";
import MantaStyle from "../index";

export default class TypeReference extends Type {
  private referenceName: string;
  private deferredArgumentedTypes: Type[] = [];
  constructor(referenceName: string) {
    super();
    this.referenceName = referenceName;
  }
  public argumentTypes(types: Type[]) {
    this.deferredArgumentedTypes = types;
    return this;
  }
  public mock() {
    return this.getActualType().mock();
  }
  public validate(input: any) {
    return this.getActualType().validate(input);
  }
  private getActualType() {
    // Evaluate Generics
    const actualType = MantaStyle._referenceType(this.referenceName);
    actualType.argumentTypes(this.deferredArgumentedTypes);
    return actualType;
  }
}
