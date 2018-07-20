import { MetricCard } from "./testapi";

type Fulfill<T> = {
  status: 'ok',
  data: T
}
type Failure = {
  status: 'no permisson' | 'not login',
  message: string
}
type Response<T> = Fulfill<T> | Failure;

type Config = {
  "/metricCard/findAll": {
    chart: Response<MetricCard>;
  };
};

export default Config;
