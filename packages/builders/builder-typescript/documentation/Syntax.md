# Syntax

Contents

- [New to TypeScript](#new-to-typescript)
- [Unsupported Syntax](#unsupported-syntax)

## New to TypeScript?

Manta Style supports most TypeScript syntax. If you are new to TypeScript, please check out [TypeScript Handbook](https://www.typescriptlang.org/docs/home.html).

## Unsupported Syntax

- `extends` keyword in `interface` declaration will be ignored.
- Union (`A | B`) and intersection(`A & B`) on index signatures are not supported.
- Function
- `infer` keyword
- `ReturnType<T>` and `InstanceType<T>` are not supported due to unsupported `infer` keyword and function.

## Unsupported Features

- Import third-party type declarations
