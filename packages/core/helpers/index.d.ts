export type Query<T extends string> = any;
export type Delay<T, MS extends number = 5000> = T;
export type Unsplash<
  Keyword extends string = '',
  Width extends number = 1024,
  Height extends number = 768
> = string;
