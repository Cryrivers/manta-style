# Plugins

There are two types of plugins.
The ones that help building certain type systems with Manta Style, and the ones that help mocking data.

## Mockers

<!-- TODO: separate pages -->

### `plugin-mock-example`

Provides Manta Style examples for returns. Currently supports `string` and `number`.

#### Installation

```sh
$ yarn add @manta-style/plugin-mock-example
```

#### Usage

##### `string`

Manta Style reads all `@example` strings and returns one of them at random.

```js
/**
 * @example tanhauhau
 * @example cryrivers
 * @example jennieji
 */
userName: string; // returns 'tanhauhau', 'cryrivers', or 'jennieji' at random
```

#### `number`

Manta Style returns a random value between all `@example` numbers rounded to `@precision` unit. If no `@precision` is provided, Manta Style will use 0, returning an integer. If Manta Style sees only one `@example` number, it will return that number.

```js
/**
 * @example 5
 * @example 10
 * @precision 2
 */
score: number; // 6.27
```

### `plugin-mock-faker`

<!-- draft -->

- [plugin-mock-faker](./packages/plugins/plugin-mock-faker/README.md)

### `plugin-mock-qotd`

This `string` only mock plugin generates random quote of the day from [talaikis](https://talaikis.com/random_quotes_api/)

#### Installation

```
npm install --save-dev @manta-style/plugin-mock-qotd
```

#### Usage

```typescript
/**
 * @qotd
 */
wiseWords: string; // My comedy is for children from three to 93. You do need a slightly childish sense of humour and if you haven't got that, it's very sad.
```

### `plugin-mock-iterate`

<!-- draft -->

- [plugin-mock-iterate](./packages/plugins/plugin-mock-iterate/README.md)

### `plugin-mock-range`

<!-- draft -->

- [plugin-mock-range](./packages/plugins/plugin-mock-range/README.md)

### Building Your Mock Plugins

To build your own Manta Style plugin, you will (likely) need peer dependency of `@manta-style/core`. This provides you with the `getAnnotationsByKey` util that you will use.

Your plugin should `export default` an object of the following type:

```ts
interface MockPlugin {
  name: string;
  mock: {
    StringType?: (annotations: Annotation[]) => MockResult<string>;
    NumberType?: (annotations: Annotation[]) => MockResult<number>;
    BooleanType?: (annotations: Annotation[]) => MockResult<boolean>;
    TypeLiteral?: (annotations: Annotation[]) => MockResult<AnyObject>;
  };
}
```

Here `name` is by which you wish Manta Style to extract when you annotate your type system with `@name` in the comment prior to that definition.
And `mock` is where you supply your main mocker functions.
You may support one or more of the four types.

<!-- TODO: perhaps need some more explanations here -->
<!-- TODO: add an appropriate example here -->

#### Asynchronous Mock Plugins

Your mock function may be `async`. Here is an example of an asynchronous mock function:

```ts
const qotdPlugin: MockPlugin = {
  name: 'qotd',
  mock: {
    async StringType(annotations) {
      const jsdocRange = annotationUtils.getAnnotationsByKey(
        'qotd',
        annotations,
      );
      if (jsdocRange.length === 0) {
        return null;
      }

      try {
        const response = await fetch('https://talaikis.com/api/quotes/random/');
        const json = await response.json();
        return json.quote;
      } catch (e) {
        return null;
      }
    },
  },
};
```

## Builders

<!-- draft -->

Manta Style supports TypeScript only at the moment via `plugin-builder-typescript`. More language support is coming soon.

### Building Your Builder Plugins
