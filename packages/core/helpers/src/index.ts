import QueryType from './types/QueryType';
import MantaStyle from '@manta-style/runtime';
import { MantaStyleAnnotation } from '@manta-style/core';

export const Query = MantaStyle.TypeAliasDeclaration(
  'Query',
  (typeFactory) => {
    const T = typeFactory.TypeParameter('T');
    return new QueryType(T);
  },
  MantaStyleAnnotation.empty(),
);
