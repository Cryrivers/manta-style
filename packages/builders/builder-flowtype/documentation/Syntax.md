# Syntax

Contents

- [New to Flowtype](#new-to-flowtype)
- [Unsupported Syntax](#unsupported-syntax)

## New to Flowtype?

Manta Style supports most FlowType syntax. If you are new to Flowtype, please check out [Introduction to type checking with Flow](https://flow.org/en/docs/getting-started/).

## Unsupported Syntax

- `extends` keyword in `interface` declaration will be ignored.
- Union (`A | B`) and intersection(`A & B`) on index signatures are not supported.
- Function types
- Magic type `$ObjMap`, `$TupleMap` and `$Call`
