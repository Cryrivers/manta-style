export type PrimitiveNumber = number;
type PrimitiveBoolean = boolean;

describe("Primitives", () => {
  test("Can mock", () => {
    //@ts-ignore
    console.log(PrimitiveBoolean.mock());
  });
});
