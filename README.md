# Manta Style

![CircleCI](https://img.shields.io/circleci/project/github/Cryrivers/manta-style.svg?style=flat-square)
![Codecov](https://img.shields.io/codecov/c/github/Cryrivers/manta-style.svg?style=flat-square)
![GitHub](https://img.shields.io/github/license/Cryrivers/manta-style.svg?style=flat-square)

# Quick Start

1. Install `manta-style`

```sh
yarn add --dev manta-style
```

2. Create mock api `config.ts`

```ts
interface UserProfile {
  /**
   * @example {{internet.userName}}
   */
  userName: string;
  gender: 0 | 1 | 2;
  /**
   * @example {{date.past}}
   */
  birthday: number;
  /**
   * @example {{address.country}}
   */
  country: string;
  /**
   * @example {{address.state}}
   */
  state: string;
  /**
   * @example {{address.city}}
   */
  city: string;
}
type ApiStatus = 'ok' | 'error';

type WithResponse<T> = {
  status: ApiStatus;
  data: T;
};

export type GET = {
  '/user-profile': WithResponse<UserProfile>;
};
```

3. Start `manta-style`!

```sh
ms -c ./config.ts
```

# Contributing

## Getting Started

```sh
yarn install
yarn run bootstrap
yarn run build
```

## Special Thanks

- [Zhongliang Wang](https://github.com/Cryrivers) for original idea, architecture design, initial implementation of runtime and transformers.
- [Tan Li Hau](https://github.com/tanhauhau) for the design and implementation of selective mocking, watch mode and experiments of future crazy idea.

## License

Manta Style is [MIT licensed](https://github.com/Cryrivers/manta-style/blob/master/LICENSE)
