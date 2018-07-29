type A = 'a' | 'b' | 'c' | 'd' | 'e';

type Test<T extends boolean, X extends number> = {
  x: X;
  bbb: X extends 0 ? 'nil' : 'has';
};
export type GET = {
  '/': Test<boolean, 0 | 1>;
};
