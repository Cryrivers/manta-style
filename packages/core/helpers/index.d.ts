export type Query<T extends string> = any;
export type Delay<T, MS extends number> = T;

export type Unsplash<
  Keyword extends string,
  Width extends number,
  Height extends number
> = string;
