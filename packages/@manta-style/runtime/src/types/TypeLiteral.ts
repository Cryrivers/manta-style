import {
  Type,
  Property,
  AnyObject,
  ComputedProperty,
  ComputedPropertyOperator,
  Annotation
} from "../utils";

export default class TypeLiteral extends Type {
  private properties: Property[] = [];
  private computedProperties: ComputedProperty[] = [];
  public _getProperties() {
    return this.properties;
  }
  public getKeys() {
    return this.properties.map(prop => prop.name);
  }
  public property(
    name: string,
    type: Type,
    questionMark: boolean,
    annotations: Annotation[]
  ) {
    this.properties.push({
      name,
      type,
      questionMark,
      annotations
    });
  }
  public computedProperty(
    name: string,
    keyType: Type,
    type: Type,
    operator: ComputedPropertyOperator,
    questionMark: boolean,
    annotations: Annotation[]
  ) {
    this.computedProperties.push({
      name,
      keyType,
      type,
      operator,
      questionMark,
      annotations
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
        obj[property.name] = property.type.mock(property.annotations);
      }
    }
    for (const computedProperty of this.computedProperties) {
      for (let i =0 ;i < 5; i++) {
        // TODO: Extract annotations for key and value
        const key = computedProperty.keyType.mock(computedProperty.annotations);
        const value = computedProperty.type.mock(computedProperty.annotations);
        obj[key] = value;
      }
    }
    // TODO: Process computed properties
    return obj;
  }
  public validate(input: any) {
    return true;
  }
}
