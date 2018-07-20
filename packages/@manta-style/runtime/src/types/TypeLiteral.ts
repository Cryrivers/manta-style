import {
  Type,
  Property,
  AnyObject,
  ErrorType,
  ComputedProperty,
  ComputedPropertyOperator
} from "../utils";

class GenericRef extends Type {
  private typeParamName: string;
  private actualType: Type;
  constructor(typeParamName: string) {
    super();
    this.actualType = new ErrorType(
      `Generic Params "${typeParamName}" have not been initialized. `
    );
    this.typeParamName = typeParamName;
  }
  public clone() {
    return new GenericRef(this.typeParamName);
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

function propertyOptional<T extends Property | ComputedProperty>(
  property: T
): T {
  return Object.assign(property, { questionMark: true });
}

function propertyRequired<T extends Property | ComputedProperty>(
  property: T
): T {
  return Object.assign(property, { questionMark: false });
}

export default class TypeLiteral extends Type {
  private properties: Property[] = [];
  private computedProperties: ComputedProperty[] = [];
  private genericRefs: GenericRef[] = [];
  public static partialFrom(type: TypeLiteral): TypeLiteral {
    const newTypeLiteral = new TypeLiteral();
    newTypeLiteral.properties = type.properties.map(propertyOptional);
    newTypeLiteral.computedProperties = type.computedProperties.map(
      propertyOptional
    );
    newTypeLiteral.genericRefs = type.genericRefs.map(item => item.clone());
    return newTypeLiteral;
  }
  public static requiredFrom(type: TypeLiteral): TypeLiteral {
    const newTypeLiteral = new TypeLiteral();
    newTypeLiteral.properties = type.properties.map(propertyRequired);
    newTypeLiteral.computedProperties = type.computedProperties.map(
      propertyRequired
    );
    newTypeLiteral.genericRefs = type.genericRefs.map(item => item.clone());
    return newTypeLiteral;
  }
  public ref(types: Type[]) {
    // console.assert(types.length === this.genericRefs.length);
    for (let i = 0; i < types.length; i++) {
      this.genericRefs[i].setRefType(types[i]);
    }
    return this;
  }
  public _getProperties() {
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
  public computedProperty(
    name: string,
    keyType: Type,
    type: Type,
    operator: ComputedPropertyOperator,
    questionMark: boolean
  ) {
    this.computedProperties.push({
      name,
      keyType,
      type,
      operator,
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
    // TODO: Process computed properties and index signatures
    return obj;
  }
  public validate(input: any) {
    return true;
  }
}
