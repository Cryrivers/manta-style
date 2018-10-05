import { Query, Param, Unsplash } from '@manta-style/helpers';
type Test = Param<'id'>;

export type GET = {
  /**
   * @proxy https://jsonplaceholder.typicode.com
   */
  '/todos/:id': {
    /**
     * @range 2000 5000
     */

    haha: number;
    /**
     * @example a
     * @example b
     */

    hoho: string;
    haha2: Test;
    /**
     * @length 10
     * @example a
     * @example b
     */
    zzzz: string[];
    yyyy: {
      /**
       * @key some
       * @key nice
       * @key key
       */
      [key: string]: number;
    };
  };
  /**
   * @proxy https://www.google.com
   */
  '/errorExample': { haha: number };
  '/test': { haha: Unsplash };
};
