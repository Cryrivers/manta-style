import { sample } from 'lodash-es';
import NeverKeyword from './NeverKeyword';
import { resolveReferencedType } from '../utils/referenceTypes';
import { Annotation, Type } from '@manta-style/core';
import { throwUnableToFormat } from '../utils/errorReporting';

export default class UnionType extends Type {
  private readonly types: Type[] = [];
  private chosenType?: Type;
  constructor(types: Type[], chosenType?: Type) {
    super();
    this.types = types;
    this.chosenType = chosenType;
  }
  public deriveLiteral(parentAnnotations: Annotation[]) {
    const { chosenType } = this;
    if (chosenType) {
      return chosenType;
    } else {
      const { chosenType } = this.derivePreservedUnionLiteral(
        parentAnnotations,
      );
      if (chosenType) {
        return chosenType;
      }
      throw Error('Something bad happens :(');
    }
  }
  public derivePreservedUnionLiteral(parentAnnotations: Annotation[]) {
    // TODO: Add a JSDoc property to intervene the random selection process
    const resolvedTypes = this.types.map((type) => resolveReferencedType(type));
    const derivedTypes = resolvedTypes
      .map((item) => item.type)
      .filter((type) => !(type instanceof NeverKeyword))
      .map((type) => type.deriveLiteral(parentAnnotations));
    const chosenType = sample(derivedTypes);
    return new UnionType(derivedTypes, chosenType);
  }
  public mock() {
    const { chosenType } = this;
    if (chosenType) {
      return chosenType.mock();
    }
    throw Error('Something bad happens :(');
  }
  public validate(value: unknown): value is any {
    return this.types.some((type) => type.validate(value));
  }
  public format(value: unknown) {
    for (const type of this.types) {
      try {
        return type.format(value);
      } catch {
        // Empty
      }
    }
    const potentialExpectedValues: any[] = [];
    for (const type of this.types) {
      try {
        potentialExpectedValues.push(type.mock());
      } catch {
        // Empty
      }
    }
    throwUnableToFormat({
      typeName: 'UnionType',
      reason:
        'The input cannot be validated as any type in this UnionType. ' +
        'Please check Expected Values for potentially expected values.',
      inputValue: value,
      expectedValue: potentialExpectedValues,
    });
  }
  public getTypes(): Type[] {
    return this.types;
  }
}
