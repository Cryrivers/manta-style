# Quick Start

<!-- guides to 80% of use cases -->

## Basic Usages

### Get User Profile

> Background: You are working on API for getting user info. The endpoint is `/user`.

**Plugins needed:** None

_The following config works on both TypeScript and Flow._

```typescript
export type GET = {
  '/user': {
    id: number;
    username: string;
    gender: 0 | 1;
  };
};
```

<!-- below is dumped from README.md -->

Install the packages below:

```sh
npm install --save-dev @manta-style/cli @manta-style/plugin-builder-typescript @manta-style/plugin-mock-example @manta-style/plugin-mock-faker
```

### Create mock API configuration

You could use following configuration for test purpose. For more information about syntax, please check out [Syntax](./documentation/syntax.md).

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

### Launch Manta Style

```sh
ms -c ./config.ts
```

Manta Style launches a mock server at port 3000 by default. The above-stated example would generate following output in the terminal:

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

### Access endpoints in your browser

To view the mock data of the example above-stated, just launch a browser (or `curl`, `wget`) and access `http://localhost:3000/user`. Manta Style understands your type definition and generates mock data that respects it.

As `WithResponse<User> = WithResponseSuccess<User> | WithResponseFailure`, Manta Style would randomly choose one of the types in the union type. Therefore, it could randomly generate mock data for any of following cases:

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

Press <kbd>S</kbd> to enable snapshot mode for a constant output.

Press <kbd>O</kbd> to interactively disable or proxy a mocked endpoint.
