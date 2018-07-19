import { APIResponse } from "./test-gen";

type Config = {
  "/test": {
    haha: 0 | 1 | "string";
  };
  "/user": APIResponse;
};

export default Config;
