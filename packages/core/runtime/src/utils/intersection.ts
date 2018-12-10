import { isAssignable } from './assignable';
import UnionType from '../types/UnionType';
import TypeLiteral from '../types/TypeLiteral';
import MantaStyle from '..';
import { normalizeUnion } from './union';
import { MantaStyleContext, Type } from '@manta-style/core';

export function intersection(
  S: Type,
  T: Type,
  context: MantaStyleContext,
): Type {
  if (S instanceof UnionType) {
    const unionType = new UnionType(
      S.getTypes().map((type) => intersection(type, T, context)),
    );
    return normalizeUnion(unionType, context);
  } else {
    const ST = isAssignable(S, T, context);
    const TS = isAssignable(T, S, context);
    if (!ST && !TS) {
      return MantaStyle.NeverKeyword;
    } else if (ST && TS) {
      if (S instanceof TypeLiteral && T instanceof TypeLiteral) {
        return S.compose(
          T,
          context,
        );
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
