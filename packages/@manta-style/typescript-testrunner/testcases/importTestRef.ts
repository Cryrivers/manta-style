export type Haha = {
  hahaPoint: number;
  isHaha: boolean;
};

export type Hoho = {
  hohoPoint: "haha" | "hoho";
};

export type Lolo = {
  whatInHaha: keyof Haha;
};
