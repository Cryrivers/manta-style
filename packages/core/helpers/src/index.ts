import QueryType from './types/QueryType';
import ParamType from './types/ParamType';
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

export const Param = MantaStyle.TypeAliasDeclaration(
  'Param',
  (typeFactory) => {
    const T = typeFactory.TypeParameter('T');
    return new ParamType(T);
  },
  [],
);

export const Delay = MantaStyle.TypeAliasDeclaration(
  'Delay',
  (typeFactory) => {
    const T = typeFactory.TypeParameter('T');
    const MS = typeFactory.TypeParameter(
      'MS',
      MantaStyle.NumberKeyword,
      MantaStyle.Literal(5000),
    );
    return new DelayType(T, MS);
  },
  [],
);

export const Unsplash = MantaStyle.TypeAliasDeclaration(
  'Unsplash',
  (typeFactory) => {
    const K = typeFactory.TypeParameter(
      'K',
      MantaStyle.StringKeyword,
      MantaStyle.Literal(''),
    );
    const W = typeFactory.TypeParameter(
      'W',
      MantaStyle.NumberKeyword,
      MantaStyle.Literal(1024),
    );
    const H = typeFactory.TypeParameter(
      'H',
      MantaStyle.NumberKeyword,
      MantaStyle.Literal(768),
    );
    return new UnsplashType(K, W, H);
  },
  [],
);
