import UnionType from './UnionType';
import KeyOfKeyword from './KeyOfKeyword';
import {
  Property,
  ComputedProperty,
  ComputedPropertyOperator,
  AnyObject,
} from '../utils/baseType';
import { resolveReferencedType } from '../utils/referenceTypes';
import NeverKeyword from './NeverKeyword';
import { intersection } from '../utils/intersection';
import {
  Annotation,
  MantaStyleContext,
  annotationUtils,
  Type,
} from '@manta-style/core';
import MantaStyle from '..';

export default class TypeLiteral extends Type {
  private properties: Property[] = [];
  private computedProperties: ComputedProperty[] = [];
  public _getProperties() {
    return this.properties;
  }
  public _getComputedProperties() {
    return this.computedProperties;
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
  public deriveLiteral(
    parentAnnotations: Annotation[],
    context: MantaStyleContext,
  ) {
    const typeLiteral = new TypeLiteral();

    for (const property of this.properties) {
      typeLiteral.property(
        property.name,
        property.type.deriveLiteral(
          annotationUtils.inheritAnnotations(
            parentAnnotations,
            property.annotations,
          ),
          context,
        ),
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
            const literal = computedProperty.type.deriveLiteral(
              jsDocForValues,
              context,
            );
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
            computedProperty.type.deriveLiteral(jsDocForValues, context),
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
        const { type: actualType } = resolveReferencedType(keyType, context);
        if (
          actualType instanceof KeyOfKeyword ||
          actualType instanceof UnionType
        ) {
          const keys =
            actualType instanceof KeyOfKeyword
              ? actualType.getKeys(context)
              : actualType
                  .getTypes()
                  .map((type) => type.deriveLiteral([], context).mock());
          for (const key of keys) {
            const chance = computedProperty.questionMark ? Math.random() : 1;
            if (chance > 0.5) {
              subTypeLiteral.property(
                key,
                computedProperty.type.deriveLiteral(
                  computedProperty.annotations,
                  context,
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
  public validate(value: unknown, context: MantaStyleContext): value is any {
    if (
      typeof value !== 'object' ||
      value === null ||
      Object.keys(value).length <
        this.properties.filter((item) => !item.questionMark).length
    ) {
      return false;
    } else {
      return Object.keys(value).every((property) => {
        const foundProperty = this.properties.find(
          (type) => type.name === property,
        );
        if (foundProperty) {
          // @ts-ignore
          const propertyValue = value[property];
          return foundProperty.questionMark
            ? foundProperty.type.validate(propertyValue, context) ||
                MantaStyle.UndefinedKeyword.validate(propertyValue)
            : foundProperty.type.validate(propertyValue, context);
        }
        return false;
      });
    }
    // TODO: take account of computed properties
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
  public compose(type: TypeLiteral, context: MantaStyleContext): TypeLiteral {
    const composedTypeLiteral = new TypeLiteral();
    const SProperties = this.properties;
    const TProperties = type.properties;
    for (const propS of SProperties) {
      const propT = TProperties.find((item) => item.name === propS.name);
      if (propT) {
        composedTypeLiteral.property(
          propS.name,
          intersection(propS.type, propT.type, context),
          [propS.questionMark, propT.questionMark].every(Boolean),
          [...propS.annotations, ...propT.annotations],
        );
      } else {
        composedTypeLiteral.property(
          propS.name,
          propS.type,
          propS.questionMark,
          propS.annotations,
        );
      }
    }
    for (const propT of TProperties) {
      const propS = SProperties.find((item) => item.name === propT.name);
      if (!propS) {
        composedTypeLiteral.property(
          propT.name,
          propT.type,
          propT.questionMark,
          propT.annotations,
        );
      }
    }
    // TODO: merge computed properties
    return composedTypeLiteral;
  }
}
