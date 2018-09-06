# Manta Style [![CircleCI](https://img.shields.io/circleci/project/github/Cryrivers/manta-style.svg?style=flat-square)](https://circleci.com/gh/Cryrivers/manta-style) [![Codecov](https://img.shields.io/codecov/c/github/Cryrivers/manta-style.svg?style=flat-square)](https://codecov.io/gh/Cryrivers/manta-style/) [![GitHub](https://img.shields.io/github/license/Cryrivers/manta-style.svg?style=flat-square)](https://github.com/Cryrivers/manta-style/blob/master/LICENSE) [![Greenkeeper badge](https://badges.greenkeeper.io/Cryrivers/manta-style.svg?style=flat-square)](https://greenkeeper.io/)

> 🚀 Futuristic API Mock Server for Frontend

Contents

- [Motivation](#Motivation)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Usage](#usage)
- [Contributing](#contributing)
- [Acknowledgments](#acknowledgments)
- [License](#license)

## Motivation

[Manta Style](https://github.com/Cryrivers/manta-style/issues/1) generates "real" _(enough)_ mock data from your type definitions.

With _Manta Style_, you can start implementing feature once your data schema is defined.
But _Manta Style_ is more than just that.

### Generates mock data directly from your type declarations

Manta Style officially supports TypeScript and Flow at the moment.

<!-- some more words goes here @TODO wgao19 -->

### Mock data with respect to real world scenario such as past dates, addresses, names

```ts
interface User {
  /**
   * @faker {{internet.userName}}
   *
   */
  userName: string; // Amina.Langosh49

  /**
   * @faker date.past
   */
  birthday: number; // 1529370938452

  /**
   * @example Croatia
   */
  country: string; // Croatia
}
```

### Mock conditions specific to your type definitions

```ts
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
```

Manta Style will generate either the error case or the normal case according to your declarations.
Already have your list of error conditions and messages well-defined with your back end? You are in the luck! Manta Style will generate those cases for you just like in real world.

This also gives us one more motivation to fine-tuned the typing to our codebase.

### Fix a test case like a snapshot.

Implementing boundary cases has been hair pulling. With Manta Style you can supply a snapshot and have it returned every time until you finish.

### ... and more

Need more feature? [Create an issue](https://github.com/Cryrivers/manta-style/issues/new/choose) and let us know how Manta Style can help you.

## Installation

### CLI

```sh
npm install --save-dev @manta-style/cli
```

<!--

global install issue:
cannot link the builder plugin if built globally

commenting this part of the docs out for now

To install globally

```
npm install -g @manta-style/cli
```

This adds a command line tool `ms` to your system.
-->

### Builders

Manta Style supports generation of mock data from different typing systems via binding builders.
You need to add the corresponding builder plugin to your project.

In [Quick Start](#quick-start) we show an example using TypeScript.

```sh
npm install --save-dev @manta-style/plugin-builder-typescript
```

Check out docs on [builder plugins](#) for more information on currently supported builders and for information on implementing your own type systems.

### Plugins

Manta Style supports a handful of data generating features via plugins.
One major example is `@manta-style/plugin-mock-faker`. This is a plugin that enables you to generate fake datas that look real.

You could check [Plugins](#plugins) for the usages of official plugins. You could make our own plugins as well.

<!-- TODO: add support for creating plugins? -->

## Quick Start

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

## Usage

```
$ ms --help

  Usage: ms [options]

  Options:

    -V, --version              output the version number
    -c --configFile <file>     the TypeScript config file to generate entry points
    -p --port <i> [3000]       To use a port different than 3000
    --proxyUrl <url>           To enable proxy for disabled endpoints
    --generateSnapshot <file>  To generate a API mock data snapshot (Not yet implemented.)
    --useSnapshot <file>       To launch a server with data snapshot
    -v --verbose               show debug information
    -h, --help                 output usage information
```

## Contributing

### Getting Started

```sh
yarn install
yarn run bootstrap
yarn run build
```

## Acknowledgments

- [Zhongliang Wang](https://github.com/Cryrivers) for original idea, architecture design, initial implementation of runtime and transformers.
- [Tan Li Hau](https://github.com/tanhauhau) for the design and implementation of selective mocking, plugin system, FlowType support and many official plugins.
- [Jennie Ji](https://github.com/JennieJi) for implementation of live-reload feature.
- [Wei Gao](https://github.com/wgao19) for brilliant documentation.

## License

Manta Style is [MIT licensed](https://github.com/Cryrivers/manta-style/blob/master/LICENSE)
