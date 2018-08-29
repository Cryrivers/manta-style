# @manta-style/plugin-mock-faker

## Installation
```sh
$ yarn add @manta-style/plugin-mock-faker
```

## Usage

```js
/**
 * @faker {{internet.userName}}
 */
userName: string;
/**
 * @faker {{address.city}}, {{address.state}}, {{address.country}}
 */
 address: string;
/**
 * @faker date.past
 */
 lastLoggedIn: number;
```

- Use [faker.js](https://github.com/marak/faker.js/) to generate mock data
- for `String` type, will call [faker.fake](https://github.com/marak/Faker.js/#fakerfake) to generate mock data
- For `Number` type, will call `faker.method.path()` to generate the mock data
