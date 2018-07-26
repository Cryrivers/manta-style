/**
 * Exclude from T those export types that are assignable to U
 */
export type Exclude<T, U> = T extends U ? never : T;

/**
 * Extract from T those export types that are assignable to U
 */
export type Extract<T, U> = T extends U ? T : never;

/**
 * Exclude null and undefined from T
 */
export type NonNullable<T> = T extends null | undefined ? never : T;
