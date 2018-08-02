import { Type } from './baseType';
import { isAssignable } from './assignable';
import UnionType from '../types/UnionType';
import TypeLiteral from '../types/TypeLiteral';
import MantaStyle from '..';

export function intersection(S: Type, T: Type): Type {
  if (S instanceof UnionType) {
    return new UnionType(S.getTypes().map((type) => intersection(type, T)));
  } else {
    const ST = isAssignable(S, T);
    const TS = isAssignable(T, S);
    if (!ST && !TS) {
      return MantaStyle.NeverKeyword;
    } else if (ST && TS) {
      if (S instanceof TypeLiteral && T instanceof TypeLiteral) {
        return S.compose(T);
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
