# Syntax (WIP)
Contents
- [New to TypeScript](#new-to-typescript)
- [Basic Usage](#basic-usage)
- [Advanced Usage](#advanced-usage)
- [Unsupported Syntax](#unsupported-syntax)
- [JSDoc Annotations](#jsdoc-annotations)

## New to TypeScript?
Manta Style supports most TypeScript syntax. If you are new to TypeScript, please check out [TypeScript Handbook](https://www.typescriptlang.org/docs/home.html).

## Basic Usage
WIP

## Advanced Usage
WIP

## Unsupported Syntax
- `extends` keyword in `interface` declaration will be ignored.
- Union (`A | B`) and intersection(`A & B`) on index signatures are not supported.

## JSDoc Annotations

### String
String types support `@example` JSDoc annotations to specify mock strings. Multiple `@example`s would be randomly-chosen. As `fake.js` built in, [mustache syntax](https://github.com/marak/Faker.js/#fakerfake) in `faker.js` could be used to generate more realistic fake data like names, address, etc.