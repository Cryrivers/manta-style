type UserResponse<T> = {
  status: "ok" | "fail";
  balance: number;
  testAccount?: boolean;
  testGeneric: T;
};

export type APIResponse = {
  data1: number[];
  data2: Array<UserResponse<number>>;
};

describe("Generics", () => {
  test("Can mock", () => {
    //@ts-ignore
    console.log(APIResponse.mock());
  });
});
