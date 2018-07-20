import { MetricCard } from "./testapi";

type Fulfill<T> = {
  status: 'ok',
  data: T
}
type Failure = {
  status: 'no permisson' | 'not login',
  /**
   *
   * @example You are too handsome to use
   * @example Server Error
   * @type {string}
   */
  message: string
}
type Response<T> = Fulfill<T> | Failure;

type Config = {
  "/metricCard/findAll": Response<MetricCard>;
};

export default Config;
