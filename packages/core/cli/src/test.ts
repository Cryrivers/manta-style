import { Query } from '@manta-style/helpers';
type Test = Query<'haha'>;

export type GET = {
  /**
   * @proxy https://jsonplaceholder.typicode.com
   */
  '/todos/1': { haha: number; haha2: Test };
  /**
   * @proxy https://www.google.com
   */
  '/errorExample': { haha: number };
  '/test': { haha: number };
};
