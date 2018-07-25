type A = "a" | "b" | "c" | "d" | "e";
type Exclude<T, U> = T extends U ? never : T;

type Test<T extends boolean> = {
  value: T;
  obj: T extends true ? { nice: string } : never;
};
export type GET = {
  "/": Test<boolean>;
};
