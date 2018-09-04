/**
 * @preserveUnion
 */
export type $Keys<T> = keyof T;

/**
 * @preserveUnion
 */
export type $Values<T> = T[keyof T];

/**
 * @preserveUnion
 */
export type $PropertyType<T, K extends keyof T> = { [P in K]: T[P] };

/**
 * @preserveUnion
 */
export type $Shape<T> = { [P in keyof T]?: T[P] };

/**
 * @preserveUnion
 */
export type $ReadOnly<T> = T;

/**
 * @preserveUnion
 */
export type $Exact<T> = T;

/**
 * @preserveUnion
 */
export type $Diff<A, B> = A extends B ? never : A;

/**
 * @preserveUnion
 */
export type $Rest<A, B> = A extends B ? never : (A | undefined);

/**
 * @preserveUnion
 */
export type $NonMaybeType<T> = T extends null | undefined ? never : T;

/**
 * @preserveUnion
 */
export type Array<T> = T[];

/**
 * @preserveUnion
 */
export type $ReadOnlyArray<T> = T[];
