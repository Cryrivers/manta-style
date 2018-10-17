# Quick Start

Ready to jump in?

Here we show an example using TypeScript.

As mentioned earlier in the [Installation](./Installation.md) section, we will always need the CLI.
This example supports both [TypeScript](http://www.typescriptlang.org/) and [FlowType](http://flowtype.org). Therefore, we will need `@manta-style/builder-typescript` or `@manta-style/builder-flowtype`.
Meanwhile, we need [`mock-faker`](./Plugins.md#mock-faker). Let's add all of them together:

- TypeScript users

```sh
npm install --save-dev @manta-style/cli @manta-style/builder-typescript @manta-style/mock-faker
```

- Flowtype Users

```sh
npm install --save-dev @manta-style/cli @manta-style/builder-flowtype @manta-style/mock-faker
```

## Basic Usages

The Manta-Style CLI works reads a config file that describes your server endpoints and serves the mock data it generates. Once you have added Manta-Style to your package and have your config file ready, say `config.ts`, you may start the server in command line by:

```
ms -c ./config.ts
```

Describing your API end point is also straightforward, simply `export` a type object where the object keys are your endpoints, and the value corresponds to the shape of your desired return:

```typescript
export type GET = {
  '/endpoint': {
    // shape of return
  };
};
```

As an example, let's say we want to mock a `/user` API to get user info.

<!-- _The following config works on both TypeScript and Flow._ -->

```ts
// config.js
export type GET = {
  '/user': {
    id: number;
    userName: string;
    gender: 0 | 1;
  };
};
```

You may define a `User` type separately and pass it in as return, like this:

```ts
// config.js
interface User {
  id: number;
  userName: string;
  gender: 0 | 1;
  birthday: number;
  country: string;
  state: string;
  city: string;
}
export type GET = {
  '/user': User;
};
```

Normally, a server success return is not directly the `User` object. Instead, it normally is an object that _contains_ a field of the `User` object. It may contain some other field indicating its return status. You can follow the type system's convention and define a `WithResponseSuccess<T>` generic and use it with type `User`:

```ts
// config.js

// ...
type WithResponseSuccess<T> = {
  status: 'ok';
  data: T;
};

export type GET = {
  '/user': WithResponseSuccess<User>;
};
```

In real world an API call often fails. Your mock data shall be able to generate error return as well. To do that, simply define your error type and pass it in as an `or` with the `User` type:

```ts
// config.js

// ...
type WithResponseFailure = {
  status: 'error';
  message: string;
};

export type GET = {
  '/user': WithResponseSuccess<User> | WithResponseFailure;
};
```

And of course you can create another `WithResponse` generic:

```ts
// config

// ...
type WithResponse<T> = WithResponseSuccess<T> | WithResponseFailure;
export type GET = {
  '/user': WithResponse<User>;
};
```

Now run

```
ms -c ./config.ts
```

Manta Style will a mock server at port 3000 by default. The example would generate following output in the terminal:

```
Manta Style launched at http://localhost:3000
┌────────┬────────────────────────────┬────────┬───────┐
│ Method │ Endpoint                   │ Mocked │ Proxy │
├────────┼────────────────────────────┼────────┼───────┤
│ GET    │ http://localhost:3000/user │ Y      │       │
└────────┴────────────────────────────┴────────┴───────┘
Press O to configure selective mocking
[FAKER MODE] Press S to take an instant snapshot
```

Now you can visit the endpoint in browser or call `curl`, `wget` and see that Manta Style returns the mock data according to your type definitions.

Note that Manta-Style randomly chooses one of the types in our `WithResponse<User>` union type.

Try pressing `S`, you will find a file under your project directory with filename `ms.snapshot.json` that is exactly the last call return.
You may use that for other purposes such as saving as test case snapshot or feed in to your `json-server`, etc.

<!-- TODO add this section and put a link here -->

## Using Mock Plugins

To use plugins, annotate the field with comments with `@${name}`, where `name` is the variable defined in your plugin, followed by a space and then the required parameter.

The following example showcases several common usages with our `mock-example` and `mock-faker` plugins.

```ts
interface User {
  /**
   * @faker {{internet.userName}}
   */
  userName: string;
  gender: 0 | 1 | 2;
  /**
   * @faker date.past
   */
  birthday: number;
  /**
   * @faker {{address.country}}
   */
  country: string;
  /**
   * @faker {{address.state}}
   */
  state: string;
  /**
   * @faker {{address.city}}
   */
  city: string;
}

type WithResponseSuccess<T> = {
  status: 'ok';
  data: T;
};

type WithResponseFailure = {
  status: 'error';
  /**
   * @example Bad Request
   */
  message: string;
};

type WithResponse<T> = WithResponseSuccess<T> | WithResponseFailure;

export type GET = {
  '/user': WithResponse<User>;
};
```

Check in the browser, refresh a few times and notice that Manta-Style returns the following two types of outputs randomly, and with the expected mock results.

1. `WithResponseSuccess<User>`:

```json
{
  "status": "ok",
  "data": {
    "userName": "Zachariah.VonRueden20",
    "gender": 2,
    "birthday": 646869600,
    "country": "Holy See (Vatican City State)",
    "state": "Massachusetts",
    "city": "South Evietown"
  }
}
```

2. `WithResponseFailure`:

```json
{ "status": "error", "message": "Bad Request" }
```

Next, you may move on to read about more advanced and fun [Examples](./Examples.md) and [Manta-Style's CLI commands](./Usage.md).
