type A = "a" | "b" | "c" | "d" | "e";

type Test<T extends boolean> = {
  value: T;
  obj: T extends true ? { nice: string } : never;
  aaa: Exclude<A, "d" | "e">;
};
export type GET = {
  "/": Test<boolean>;
};
