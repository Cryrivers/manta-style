import UnionType from './UnionType';
import KeyOfKeyword from './KeyOfKeyword';
import {
  Type,
  Property,
  ComputedProperty,
  Annotation,
  ComputedPropertyOperator,
  AnyObject,
} from '../utils/baseType';
import { resolveReferencedType } from '../utils/referenceTypes';
import NeverKeyword from './NeverKeyword';

export default class TypeLiteral extends Type {
  private properties: Property[] = [];
  private computedProperties: ComputedProperty[] = [];
  public _getProperties() {
    return this.properties;
  }
  public getKeys() {
    return this.properties.map((prop) => prop.name);
  }
  public property(
    name: string,
    type: Type,
    questionMark: boolean,
    annotations: Annotation[],
  ) {
    this.properties.push({
      name,
      type,
      questionMark,
      annotations,
    });
  }
  public computedProperty(
    name: string,
    keyType: Type,
    type: Type,
    operator: ComputedPropertyOperator,
    questionMark: boolean,
    annotations: Annotation[],
  ) {
    this.computedProperties.push({
      name,
      keyType,
      type,
      operator,
      questionMark,
      annotations,
    });
  }
  public deriveLiteral() {
    const typeLiteral = new TypeLiteral();

    for (const property of this.properties) {
      typeLiteral.property(
        property.name,
        property.type.deriveLiteral(property.annotations),
        property.questionMark,
        property.annotations,
      );
    }

    // Enumerate IndexSignatures
    for (const computedProperty of this.computedProperties) {
      const jsDocForKeys: Annotation[] = computedProperty.annotations
        .filter((item) => item.key === 'key')
        .map((item) => ({ ...item, key: 'example' }));
      const jsDocForValues: Annotation[] = computedProperty.annotations.filter(
        (item) => item.key !== 'key',
      );

      if (
        computedProperty.operator === ComputedPropertyOperator.INDEX_SIGNATURE
      ) {
        if (jsDocForKeys.length > 0) {
          for (let i = 0; i < jsDocForKeys.length; i++) {
            const chance = computedProperty.questionMark ? Math.random() : 1;
            const literal = computedProperty.type.deriveLiteral(jsDocForValues);
            // TODO: Remove the assumption of string index signature.
            // support number in future
            if (chance > 0.5) {
              typeLiteral.property(
                jsDocForKeys[i].value,
                literal,
                false,
                jsDocForValues,
              );
            }
          }
        } else {
          typeLiteral.property(
            'This is a key. Customize it with JSDoc tag @key',
            computedProperty.type.deriveLiteral(jsDocForValues),
            false,
            jsDocForValues,
          );
        }
      } else if (
        computedProperty.operator === ComputedPropertyOperator.IN_KEYWORD
      ) {
        // TODO: Need to review again, didnt deal with 2 question marks perfectly
        const { keyType, name } = computedProperty;
        const subTypeLiteral = new TypeLiteral();
        // TODO: Correct annotation
        typeLiteral.property(name, subTypeLiteral, false, []);
        const actualType = resolveReferencedType(keyType);
        if (
          actualType instanceof KeyOfKeyword ||
          actualType instanceof UnionType
        ) {
          const keys =
            actualType instanceof KeyOfKeyword
              ? actualType.getKeys()
              : actualType
                  .getTypes()
                  .map((type) => type.deriveLiteral().mock());
          for (const key of keys) {
            const chance = computedProperty.questionMark ? Math.random() : 1;
            if (chance > 0.5) {
              subTypeLiteral.property(
                key,
                computedProperty.type.deriveLiteral(
                  computedProperty.annotations,
                ),
                false,
                computedProperty.annotations,
              );
            }
          }
        } else {
          console.log(actualType);
          throw new Error(`Unsupported Type after keyword "in"`);
        }
      }
    }
    return typeLiteral;
  }
  public mock() {
    const obj: AnyObject = {};
    for (const property of this.properties) {
      const chance = property.questionMark ? Math.random() : 1;
      if (!(property.type instanceof NeverKeyword) && chance > 0.5) {
        obj[property.name] = property.type.mock();
      }
    }
    return obj;
  }
}
