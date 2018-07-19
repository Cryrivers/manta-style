import { Type, Property, AnyObject, ErrorType } from "../utils";

class GenericRef extends Type {
  private actualType: Type;
  constructor(typeParamName: string) {
    super();
    this.actualType = new ErrorType(
      `Generic Params "${typeParamName}" have not been initialized. `
    );
  }
  public setRefType(type: Type) {
    this.actualType = type;
  }
  public getRefType() {
    return this.actualType;
  }
  public mock() {
    return this.actualType.mock();
  }
  public validate(input: any) {
    return this.actualType.validate(input);
  }
}

export default class TypeLiteral extends Type {
  private properties: Property[] = [];
  private genericRefs: GenericRef[] = [];
  public ref(types: Type[]) {
    // console.assert(types.length === this.genericRefs.length);
    for (let i = 0; i < types.length; i++) {
      this.genericRefs[i].setRefType(types[i]);
    }
    return this;
  }
  private _getProperties() {
    return this.properties;
  }
  public getKeys() {
    return this.properties.map(prop => prop.name);
  }
  public RefType(typeParamName: string) {
    const newGenericType = new GenericRef(typeParamName);
    this.genericRefs.push(newGenericType);
    return newGenericType;
  }
  public property(name: string, type: Type, questionMark: boolean) {
    this.properties.push({
      name,
      type,
      questionMark
    });
  }
  public mock() {
    const obj: AnyObject = {};
    for (const property of this.properties) {
      const chance = property.type.neverType
        ? 0
        : property.questionMark
          ? Math.random()
          : 1;
      if (chance > 0.5) {
        obj[property.name] = property.type.mock();
      }
    }
    return obj;
  }
  public validate(input: any) {
    return true;
  }
}
