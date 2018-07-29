/**
 * Exclude from T those export types that are assignable to U
 * @preserveUnion
 */
export type Exclude<T, U> = T extends U ? never : T;

/**
 * Extract from T those export types that are assignable to U
 * @preserveUnion
 */
export type Extract<T, U> = T extends U ? T : never;

/**
 * Exclude null and undefined from T
 * @preserveUnion
 */
export type NonNullable<T> = T extends null | undefined ? never : T;
