import { Annotation, Type } from '../utils/baseType';
import { sample } from 'lodash-es';
import NeverKeyword from './NeverKeyword';
import { resolveReferencedType } from '../utils/referenceTypes';

export default class UnionType extends Type {
  private readonly types: Type[] = [];
  private chosenType?: Type;
  constructor(types: Type[], chosenType?: Type) {
    super();
    this.types = types;
    this.chosenType = chosenType;
  }
  public async deriveLiteral(parentAnnotations: Annotation[]) {
    const { chosenType } = this;
    if (chosenType) {
      return chosenType;
    } else {
      const { chosenType } = await this.derivePreservedUnionLiteral(
        parentAnnotations,
      );
      if (chosenType) {
        return chosenType;
      }
      throw Error('Something bad happens :(');
    }
  }
  public async derivePreservedUnionLiteral(parentAnnotations: Annotation[]) {
    const resolvedTypes = await Promise.all(
      this.types.map(resolveReferencedType),
    );

    const derivedTypes = await Promise.all(
      resolvedTypes
        .map((item) => item.type)
        .filter((type) => !(type instanceof NeverKeyword))
        .map((type) => type.deriveLiteral(parentAnnotations)),
    );
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
  public getTypes(): Type[] {
    return this.types;
  }
}
