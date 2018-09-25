import { Query, Param, Unsplash } from '@manta-style/helpers';
type Test = Param<'id'>;

export type GET = {
  /**
   * @proxy https://jsonplaceholder.typicode.com
   */
  '/todos/:id': { haha: number; haha2: Test };
  /**
   * @proxy https://www.google.com
   */
  '/errorExample': { haha: number };
  '/test': { haha: Unsplash };
};
