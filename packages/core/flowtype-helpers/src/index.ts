export type $Keys<T> = keyof T;

export type $Values<T> = T[keyof T];

export type $PropertyType<T, K extends keyof T> = { [P in K]: T[P] };

export type $Shape<T> = { [P in keyof T]?: T[P] };

export type $ReadOnly<T> = T;

export type $Exact<T> = T;

export type $Diff<A, B> = A extends B ? never : A;

export type $Rest<A, B> = A extends B ? never : (A | undefined);

export type $NonMaybeType<T> = T extends null | undefined ? never : T;

export type Array<T> = T[];

export type $ReadOnlyArray<T> = T[];
