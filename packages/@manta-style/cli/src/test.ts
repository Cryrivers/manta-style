import { unstable_Query } from '@manta-style/cli/typings';

type A = 'a' | 'b' | 'c' | 'd' | 'e';

type Attribute = unstable_Query<'attribute'>;

type Test<T extends boolean, X extends number> = {
  x: X;
  bbb: X extends 0 ? 'nil' : 'has';
  haha: Attribute;
};
export type GET = {
  '/': Test<boolean, 0 | 1>;
};
