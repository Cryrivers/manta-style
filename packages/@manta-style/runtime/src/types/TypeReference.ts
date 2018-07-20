import { Type } from "../utils";
import MantaStyle from "../index";

// TODO: Support generics
export default class TypeReference extends Type {
  private referenceName: string;
  private deferredGenericTypes: Type[] = [];
  constructor(referenceName: string) {
    super();
    this.referenceName = referenceName;
  }
  public ref(types: Type[]) {
    this.deferredGenericTypes = types;
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
    actualType.ref(this.deferredGenericTypes);
    return actualType;
  }
}
