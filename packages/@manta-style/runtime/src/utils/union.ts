import UnionType from '../types/UnionType';
import { Type } from './baseType';
import MantaStyle from '..';
import NeverKeyword from '../types/NeverKeyword';
import { resolveReferencedType } from './referenceTypes';

export function normalizeUnion(unionType: UnionType): Type {
  // Filter out all 'never' keyword, since X | never = X
  const types = unionType
    .getTypes()
    .map(resolveReferencedType)
    .map((item) => item.type)
    .filter((type) => !(type instanceof NeverKeyword));
  const { length } = types;
  if (length === 0) {
    // No union elements in this union type
    // just return 'never'
    return MantaStyle.NeverKeyword;
  } else if (length === 1) {
    // Only one union element found, so UnionType
    // makes no sense, just return that type
    return types[0];
  } else {
    // Return a UnionType without 'never' keywords
    return new UnionType(types);
  }
}
