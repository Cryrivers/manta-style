import { Type } from '../utils/baseType';
import { isAssignable } from '../utils/assignable';
import MantaStyle from '..';
import TypeLiteral from './TypeLiteral';
import { resolveReferencedType } from '../utils/referenceTypes';
import UnionType from './UnionType';

function intersection(S: Type, T: Type): Type {
  if (S instanceof UnionType) {
    return new UnionType(S.getTypes().map((type) => intersection(type, T)));
  } else {
    const ST = isAssignable(S, T);
    const TS = isAssignable(T, S);
    if (!ST && !TS) {
      return MantaStyle.NeverKeyword;
    } else if (ST && TS) {
      if (S instanceof TypeLiteral && T instanceof TypeLiteral) {
        // TODO: Compose two type literals
        return new TypeLiteral();
      } else {
        return S;
      }
    } else if (ST) {
      return S;
    } else {
      return T;
    }
  }
}

export default class IntersectionType extends Type {
  private types: Type[];
  constructor(types: Type[]) {
    super();
    this.types = types;
  }
  public deriveLiteral() {
    const reducedType = this.types
      .map(resolveReferencedType)
      .reduce((previousType, currentType) =>
        intersection(previousType, currentType),
      );
    return reducedType.deriveLiteral();
  }
  public getTypes() {
    return this.types;
  }
}
