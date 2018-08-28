import { Type, MantaStyleContext } from './baseType';
import { isAssignable } from './assignable';
import UnionType from '../types/UnionType';
import TypeLiteral from '../types/TypeLiteral';
import MantaStyle from '..';
import { normalizeUnion } from './union';

export async function intersection(
  S: Type,
  T: Type,
  context: MantaStyleContext,
): Promise<Type> {
  if (S instanceof UnionType) {
    const unionType = new UnionType(
      await Promise.all(
        S.getTypes().map((type) => intersection(type, T, context)),
      ),
    );
    return normalizeUnion(unionType, context);
  } else {
    const ST = await isAssignable(S, T, context);
    const TS = await isAssignable(T, S, context);
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
