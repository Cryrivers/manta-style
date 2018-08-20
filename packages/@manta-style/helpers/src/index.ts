import QueryType from './types/QueryType';
import MantaStyle from '@manta-style/runtime';

export const Query = MantaStyle.TypeAliasDeclaration(
  'Query',
  (typeFactory) => {
    const T = typeFactory.TypeParameter('T');
    return new QueryType(T);
  },
  [],
);
