# Manta Style [![CircleCI](https://img.shields.io/circleci/project/github/Cryrivers/manta-style.svg?style=flat-square)](https://circleci.com/gh/Cryrivers/manta-style) [![Codecov](https://img.shields.io/codecov/c/github/Cryrivers/manta-style.svg?style=flat-square)](https://codecov.io/gh/Cryrivers/manta-style/) [![GitHub](https://img.shields.io/github/license/Cryrivers/manta-style.svg?style=flat-square)](https://github.com/Cryrivers/manta-style/blob/master/LICENSE) [![Greenkeeper badge](https://badges.greenkeeper.io/Cryrivers/manta-style.svg?style=flat-square)](https://greenkeeper.io/)

> 🚀 Futuristic API Mock Server for Frontend

[Manta Style](https://github.com/Cryrivers/manta-style/issues/1) generates API mock endpoints from TypeScript type definitions automatically.

Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Usage](#usage)
- [Plugins](#plugins)
- [Contributing](#contributing)
- [Acknowledgments](#acknowledgments)
- [License](#license)

## Installation

### Yarn

```sh
yarn add -D @manta-style/cli @manta-style/plugin-mock-example @manta-style/plugin-mock-faker
```

### npm

```sh
npm install --save-dev @manta-style/cli @manta-style/plugin-mock-example @manta-style/plugin-mock-faker
```

You could also install it globally, which adds a command line tool `ms` to your system. Manta Style needs plugins to generate mock data (faker.js support for example, just install `@manta-style/plugin-mock-faker`). You could check [Plugins](#plugins) for the usages of official plugins. You could also make our own plugins as well.

If you are new to Manta Style, please install the plugins above. We are going to use them in [Quick Start](#quick-start).

## Quick Start

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

## Plugins

### Mock

- [plugin-mock-example](./packages/plugins/plugin-mock-example/README.md)
- [plugin-mock-faker](./packages/plugins/plugin-mock-faker/README.md)
- [plugin-mock-iterate](./packages/plugins/plugin-mock-iterate/README.md)
- [plugin-mock-qotd](./packages/plugins/plugin-mock-qotd/README.md)
- [plugin-mock-range](./packages/plugins/plugin-mock-range/README.md)

## Contributing

### Getting Started

```sh
yarn install
yarn run bootstrap
yarn run build
```

## Acknowledgments

- [Zhongliang Wang](https://github.com/Cryrivers) for original idea, architecture design, initial implementation of runtime and transformers.
- [Tan Li Hau](https://github.com/tanhauhau) for the design and implementation of selective mocking, plugin system, and many official plugins.
- [Jennie Ji](https://github.com/JennieJi) for implementation of live-reload feature.

## License

Manta Style is [MIT licensed](https://github.com/Cryrivers/manta-style/blob/master/LICENSE)
