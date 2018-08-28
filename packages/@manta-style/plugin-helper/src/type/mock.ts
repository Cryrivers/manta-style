import { Annotation } from '../utils/annotation';

export type MockPlugin = {
  name: string,
  mock: {
    StringType?: (
      annotations: Annotation[],
    ) => string | null | Promise<string | null>,
    NumberType?: (
      annotations: Annotation[],
    ) => number | null | Promise<number | null>,
    BooleanType?: (
      annotations: Annotation[],
    ) => boolean | null | Promise<boolean | null>,
    TypeLiteral?: (annotations: Annotation[]) => any | null | Promise<any | null>,
  },
};
