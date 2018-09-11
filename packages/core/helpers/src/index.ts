import QueryType from './types/QueryType';
import DelayType from './types/DelayType';
import UnsplashType from './types/UnsplashType';
import MantaStyle from '@manta-style/runtime';

export const Query = MantaStyle.TypeAliasDeclaration(
  'Query',
  (typeFactory) => {
    const T = typeFactory.TypeParameter('T');
    return new QueryType(T);
  },
  [],
);

export const Delay = MantaStyle.TypeAliasDeclaration(
  'Delay',
  (typeFactory) => {
    const T = typeFactory.TypeParameter('T');
    const MS = typeFactory.TypeParameter('MS');
    return new DelayType(T, MS);
  },
  [],
);

export const Unsplash = MantaStyle.TypeAliasDeclaration(
  'Unsplash',
  (typeFactory) => {
    const K = typeFactory.TypeParameter('K');
    const W = typeFactory.TypeParameter('W');
    const H = typeFactory.TypeParameter('H');
    return new UnsplashType(K, W, H);
  },
  [],
);
