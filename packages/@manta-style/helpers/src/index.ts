import QueryType from './types/QueryType';
import MantaStyle from '@manta-style/runtime';

export const Query = () =>
  MantaStyle.TypeAliasDeclaration(
    'Query',
    (currentType) => {
      const T = currentType.TypeParameter('T');
      return new QueryType(T);
    },
    [],
  );
MantaStyle.registerType('Query', Query);
