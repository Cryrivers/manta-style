/**
 * Make all properties in T optional
 * @preserveUnion
 */
export type Partial<T> = { [P in keyof T]?: T[P] };

/**
 * Make all properties in T required
 * @preserveUnion
 */
export type Required<T> = { [P in keyof T]-?: T[P] };

/**
 * Make all properties in T readonly
 * @preserveUnion
 */
export type Readonly<T> = { readonly [P in keyof T]: T[P] };

/**
 * From T pick a set of properties K
 * @preserveUnion
 */
export type Pick<T, K extends keyof T> = { [P in K]: T[P] };

/**
 * Construct a type with a set of properties K of type T
 * @preserveUnion
 */
export type Record<K extends keyof any, T> = { [P in K]: T };

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
