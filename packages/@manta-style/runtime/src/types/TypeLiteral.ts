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
    type.annotate(annotations);
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
