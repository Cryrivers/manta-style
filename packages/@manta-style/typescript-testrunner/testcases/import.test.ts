import { Haha, Hoho, Lolo } from "./importTestRef";

type ImportTest = {
  test: Haha;
  test1: Hoho;
  test2: Lolo;
};

describe("Import", () => {
  test("Can mock", () => {
    //@ts-ignore
    console.log(ImportTest.mock());
  });
});
