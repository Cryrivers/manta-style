import { Type } from '../utils/baseType';
import { sample } from 'lodash-es';
import NeverKeyword from './NeverKeyword';
import { resolveReferencedType } from '../utils/referenceTypes';

export default class UnionType extends Type {
  private types: Type[] = [];
  private chosenType?: Type;
  constructor(types: Type[], chosenType?: Type) {
    super();
    this.types = types;
    this.chosenType = chosenType;
  }
  public deriveLiteral() {
    const { chosenType } = this;
    if (chosenType) {
      return chosenType;
    } else {
      const { chosenType } = this.derivePreservedUnionLiteral();
      if (chosenType) {
        return chosenType;
      }
      throw Error('Something bad happens :(');
    }
  }
  public derivePreservedUnionLiteral() {
    const derivedTypes = this.types
      .map(resolveReferencedType)
      .filter((type) => !(type instanceof NeverKeyword))
      .map((type) => type.deriveLiteral());
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
