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
import { Annotation, annotationUtils, Type } from '@manta-style/core';
import MantaStyle from '..';
import {
  throwUnableToFormat,
  throwUnsupported,
  UnableToFormatError,
} from '../utils/errorReporting';

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
  public deriveLiteral(parentAnnotations: Annotation[]) {
    const typeLiteral = new TypeLiteral();

    for (const property of this.properties) {
      typeLiteral.property(
        property.name,
        property.type.deriveLiteral(
          annotationUtils.inheritAnnotations(
            parentAnnotations,
            property.annotations,
          ),
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
        const { type: actualType } = resolveReferencedType(keyType);
        if (
          actualType instanceof KeyOfKeyword ||
          actualType instanceof UnionType
        ) {
          const keys =
            actualType instanceof KeyOfKeyword
              ? actualType.getKeys()
              : actualType
                  .getTypes()
                  .map((type) => type.deriveLiteral([]).mock());
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
          throwUnsupported({
            typeName: 'TypeLiteral',
            message: `Unsupported Type after keyword "in", actual type is ${actualType}`,
          });
        }
      }
    }
    return typeLiteral;
  }
  public validate(value: unknown): value is any {
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
            ? new UnionType([
                foundProperty.type,
                MantaStyle.UndefinedKeyword,
              ]).validate(propertyValue)
            : foundProperty.type.validate(propertyValue);
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
    // TODO: Support computed properties
    return obj;
  }
  private findMissingProperties(value: unknown): string[] {
    const requiredProperties = this.properties.filter(
      (item) => !item.questionMark,
    );
    if (typeof value !== 'object' || value === null) {
      return requiredProperties.map((item) => item.name);
    } else {
      const inputProperties = Object.keys(value);
      return requiredProperties
        .filter((item) => !inputProperties.includes(item.name))
        .map((item) => item.name);
    }
  }
  public format(value: unknown) {
    const missingProperties = this.findMissingProperties(value);
    if (missingProperties.length > 0) {
      throwUnableToFormat({
        typeName: 'TypeLiteral',
        reason: `Missing required properties: ${missingProperties.join(', ')}.`,
        inputValue: value,
      });
    } else {
      const formattedTypeLiteral = {};
      const properties = Object.keys(value as object);
      for (const property of properties) {
        const foundProperty = this.properties.find(
          (type) => type.name === property,
        );
        if (foundProperty) {
          try {
            // @ts-ignore
            const propertyValue = value[property];
            // @ts-ignore
            formattedTypeLiteral[property] = foundProperty.questionMark
              ? new UnionType([
                  foundProperty.type,
                  MantaStyle.UndefinedKeyword,
                ]).format(propertyValue)
              : foundProperty.type.format(propertyValue);
          } catch (ex) {
            if (ex instanceof UnableToFormatError) {
              throwUnableToFormat({
                typeName: `Property \'${foundProperty.name}\'`,
                // @ts-ignore
                inputValue: value[property],
                reason: ex.getReason(),
                expectedValue: ex.getExpectedValue(),
              });
            } else {
              console.log('123');
            }
          }
        }
      }
      return formattedTypeLiteral;
    }
  }
  public compose(type: TypeLiteral): TypeLiteral {
    const composedTypeLiteral = new TypeLiteral();
    const SProperties = this.properties;
    const TProperties = type.properties;
    for (const propS of SProperties) {
      const propT = TProperties.find((item) => item.name === propS.name);
      if (propT) {
        composedTypeLiteral.property(
          propS.name,
          intersection(propS.type, propT.type),
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
