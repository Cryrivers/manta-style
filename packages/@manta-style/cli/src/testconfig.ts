import { ChartData } from "./testapi";

type Fulfill<T> = {
  status: 'ok',
  data: T
}
type Failure = {
  status: 'no permisson' | 'not login',
  /**
   * @description
   * Error message
   * @example You are too handsome to use
   * @example Server Error
   */
  message: string
}
type Response<T> = Fulfill<T> | Failure;

type Config = {
  "/metricCard/findAll": Response<ChartData>;
  "/userProfile": {
    /**
     * @example {{name.firstName}} {{name.lastName}}
     */
    name: string;
    /**
     *
     * @example {{internet.avatar}}
     */
    avatar: string;
    /**
     * @example {{internet.email}}
     */
    email: string;
    /**
     * @example {{address.streetAddress}}
     */
    address: string;
  }
};

export default Config;
