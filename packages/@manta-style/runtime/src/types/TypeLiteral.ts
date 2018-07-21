import {
  Type,
  Property,
  AnyObject,
  ComputedProperty,
  ComputedPropertyOperator,
  Annotation
} from "../utils";
import UnionType from "./UnionType";
import KeyOfKeyword from "./KeyOfKeyword";
import TypeReference from "./TypeReference";
import TypeAliasDeclaration from "../nodes/TypeAliasDeclaration";

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
    // Enumerate IndexSignatures
    for (const computedProperty of this.computedProperties) {
      const jsDocExampleForKeys: Annotation[] = computedProperty.annotations
        .filter(item => item.key === "keyExample")
        .map(item => ({ ...item, key: "example" }));

      if (
        computedProperty.operator === ComputedPropertyOperator.INDEX_SIGNATURE
      ) {
        for (let i = 0; i < 5; i++) {
          // TODO: Extract annotations for key and value
          const key = computedProperty.keyType.mock(
            jsDocExampleForKeys
          );
          const value = computedProperty.type.mock(
            computedProperty.annotations
          );
          obj[key] = value;
        }
      } else if (
        computedProperty.operator === ComputedPropertyOperator.IN_KEYWORD
      ) {
        // FIXME: I feel this implementation is not correct
        const { keyType, name } = computedProperty;
        const subobj = (obj[name] = {} as AnyObject);
        let actualType = keyType;

        // Resolve the actual type
        while (
          actualType instanceof TypeReference ||
          actualType instanceof TypeAliasDeclaration
        ) {
          if (actualType instanceof TypeReference) {
            actualType = actualType.getActualType();
          } else if (actualType instanceof TypeAliasDeclaration) {
            actualType = actualType.getType();
          } else {
            throw new Error("Something bad happens :(");
          }
        }

        if (actualType instanceof KeyOfKeyword) {
          for (const key of actualType.getKeys()) {
            subobj[key] = computedProperty.type.mock(
              computedProperty.annotations
            );
          }
        } else if (actualType instanceof UnionType) {
          for (const key of actualType.mockAll()) {
            subobj[key] = computedProperty.type.mock(
              computedProperty.annotations
            );
          }
        } else {
          console.log(actualType);
          throw new Error(`Unsupported Type after keyword "in"`);
        }
      }
    }
    return obj;
  }
  public validate(input: any) {
    return true;
  }
}
