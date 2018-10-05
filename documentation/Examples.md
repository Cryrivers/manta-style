# Examples

Contents

- [Mock Simple Data Structure](#mock-simple-data-structure)
- [Customize each field](#customize-each-field)
- [Mock an array of some data structure](#mock-an-array-of-some-data-structure)
- [Mock Success and Failure Response](#mock-success-and-failure-response)
- [Use custom types](#use-custom-types)
- [Conditional Types](#conditional-types)
- [Read information from URL](#read-information-from-url)
- [Simulate server delay](#simulate-server-delay)
- [Proxy to real servers](#proxy-to-real-servers)

## Mock Simple Data Structure

Access `/getUserInfo` to get mock user info, the response JSON contains `userid`, `userName`, `gender`.

### Packages needed

Builder: `@manta-style/builder-typescript` or `@manta-style/builder-flowtype`

### Config File

```typescript
type UserInfo = {
  userid: number;
  userName: string;
  gender: 'male' | 'female';
};
export type GET = {
  '/getUserInfo': UserInfo;
};
```

### Result

```json
{
  "userid": 6.427734778350991,
  "userName": "This is a string message. Customize it mock plugins. (https://github.com/Cryrivers/manta-style/blob/master/documentation/Plugins.md)",
  "gender": "male"
}
```

## Customize each field

Previous example can generate the data structure we want. However, some fields look not very realistic. For example, `userid` is supposed to a big integer instead of a decimal. `userName` should look like an internet username. So this example we will make our `/getUserInfo` generates more realistic data with the help of plugins

### Packages needed

Builder: `@manta-style/builder-typescript` or `@manta-style/builder-flowtype`

Mock: `@manta-style/mock-faker`

### Config File

```typescript
type UserInfo = {
  /**
   * @range 10000 99999
   */
  userid: number;
  /**
   * @faker {{internet.userName}}
   */
  userName: string;
  gender: 'male' | 'female';
};
export type GET = {
  '/getUserInfo': UserInfo;
};
```

### Result

```json
{
  "userid": 84162,
  "userName": "Milan_OConner15",
  "gender": "male"
}
```

## Mock an array of some data structure

A new endpoint `/getUserInfoList` is added, which returns `UserInfo` of muliple users.

### Packages needed

Builder: `@manta-style/builder-typescript` or `@manta-style/builder-flowtype`

Mock: `@manta-style/mock-faker`

### Config File

```typescript
type UserInfo = {
  /**
   * @range 10000 99999
   */
  userid: number;
  /**
   * @faker {{internet.userName}}
   */
  userName: string;
  gender: 'male' | 'female';
};
export type GET = {
  '/getUserInfoList': UserInfo[];
};
```

### Result

```json
[
  {
    "userid": 16935,
    "userName": "Hailee_Cremin",
    "gender": "female"
  },
  {
    "userid": 12459,
    "userName": "Westley.Carter22",
    "gender": "male"
  },
  {
    "userid": 39348,
    "userName": "Michel.Powlowski",
    "gender": "male"
  },
  {
    "userid": 63937,
    "userName": "Salvador56",
    "gender": "male"
  }
]
```

## Mock Success and Failure Response

In practice, an API endpoint does not always return a payload without error. So we also need to support to mock both success and failure conditions.

### Packages needed

Builder: `@manta-style/builder-typescript` or `@manta-style/builder-flowtype`

Mock: `@manta-style/mock-faker`

### Config File

```typescript
type UserInfo = {
  /**
   * @range 10000 99999
   */
  userid: number;
  /**
   * @faker {{internet.userName}}
   */
  userName: string;
  gender: 'male' | 'female';
};
type ResponseSuccess<T> = {
  status: 'ok';
  data: T;
};
type ResponseFailure = {
  status: 'error';
  /**
   * @example Not Authorized
   */
  message: string;
};
type Response<T> = ResponseSuccess<T> | ResponseFailure;
export type GET = {
  '/getUserInfo': Response<UserInfo>;
};
```

### Result

Manta Style outputs the success or failure response and changes when you request it. To get a fixed result, simply press <kbd>S</kbd> to generate a snapshot.

```json
{
  "status": "ok",
  "data": {
    "userid": 56856,
    "userName": "Whitney2",
    "gender": "male"
  }
}
```

```json
{
  "status": "error",
  "message": "Not Authorized"
}
```

## Use Custom Types

You can create your own types and share it on `npm`, and can also import types from communities. In this example, we will have an API endpoint `/iwantcats`, which outputs a URL to cat images on Unsplash by utilizing the custom type `Unsplash` built in `@manta-style/helpers`.

### Packages needed

Builder: `@manta-style/builder-typescript` or `@manta-style/builder-flowtype`

Mock: (None)

Package: `@manta-style/helpers`

### Config File

Import `@manta-style/helpers`:

- TypeScript

```typescript
import { Unsplash } from '@manta-style/helpers';
```

- Flow

```flow
import type { Unsplash } from '@manta-style/helpers';
```

```typescript
export type GET = {
  '/iwantcats': {
    url: Unsplash<'cats', 1600, 900>;
  };
};
```

### Result

```json
{
  "url": "https://source.unsplash.com/1600x900/?cats"
}
```

## Conditional Types

**This example supports TypeScript only**

Sometimes there are some constraints among several fields. Say we need to have a `/names` API, which populates some names and an adjective to describe them. And we assume `wgao19` is `brilliant`, `tanhauhau` is `handsome`, `jennieji` is `awesome` and `cryrivers` is dumb.

### Packages needed

Builder: `@manta-style/builder-typescript`

Mock: (None)

### Config File

```typescript
/**
 * @example wgao19
 * @example tanhauhau
 * @example jennieji
 * @example cryrivers
 */
type Name = string;

type AdjectiveForPerson<T> = T extends 'wgao19'
  ? 'brilliant'
  : T extends 'tanhauhau'
    ? 'handsome'
    : T extends 'jennieji' ? 'awesome' : 'dumb';

type Response<T> = {
  name: T;
  adjective: AdjectiveForPerson<T>;
};

export type GET = {
  '/names': Response<Name>;
};
```

### Result

It randomly generates one of following 4 responses. The `adjective` will always match the `name`.

```json
{
  "name": "wgao19",
  "adjective": "brilliant"
}
```

```json
{
  "name": "tanhauhau",
  "adjective": "handsome"
}
```

```json
{
  "name": "jennieji",
  "adjective": "awesome"
}
```

```json
{
  "name": "cryrivers",
  "adjective": "dumb"
}
```

## Read information from URL (Basic)

Sometimes we might be interested in information in URLs. URL queries for example, say we have a request `/test?country=Singapore`, we want to read the `country` as a Type. Another example is URL params, say we have a request `/todo/1`, we want to read the id `1`.

### Packages needed

Builder: `@manta-style/builder-typescript` or `@manta-style/builder-flowtype`

Mock: (None)

Package: `@manta-style/helpers`

### Config File

Import `@manta-style/helpers`:

- TypeScript

```typescript
import { Query, Param } from '@manta-style/helpers';
```

- Flow

```flow
import type { Query, Param } from '@manta-style/helpers';
```

```typescript
type Country = Query<'country'>;
type TodoId = Param<'id'>;

export type GET = {
  '/test': { country: Country };
  '/todo/:id': { id: TodoId };
};
```

### Result

Result for URL `/test?country=Singapore`

```json
{
  "country": "Singapore"
}
```

Result for URL `/todo/1`

```json
{
  "id": "1"
}
```

## Read information from URL (Advanced)

**This example supports TypeScript only**

Since we read information from URL as TypeScript types, not only do they support to display, but also support conditional types.

Back to our `/getUserInfo` example, say we need to have an upgraded `/getInfo` endpoint, which gets a `UserInfo` given URL queries `type=user&userid={userid}` or gets a `GroupInfo` given URL queries `type=group&groupid={groupid}`.

### Packages needed

Builder: `@manta-style/builder-typescript`

Mock: `@manta-style/mock-faker`

Package: `@manta-style/helpers`

### Config File

```typescript
import { Query } from '@manta-style/helpers';

type Type = Query<'type'>;
type UserId = Query<'userid'>;
type GroupId = Query<'groupid'>;

type UserInfo<UID> = {
  userid: UID;
  /**
   * @faker {{internet.userName}}
   */
  userName: string;
  gender: 'male' | 'female';
};

type GroupInfo<GID> = {
  groupid: GID;
  /**
   * @faker {{commerce.productAdjective}} {{commerce.productName}}
   */
  groupName: string;
  /**
   * @faker {{address.streetAddress}}, {{address.zipCode}}
   */
  address: string;
};

export type GET = {
  '/getUserInfo': Type extends 'user' ? UserInfo<UserId> : GroupInfo<GroupId>;
};
```

### Result

## Simulate Server Delay

Sometime we might need to test against [chaos monkey](https://en.wikipedia.org/wiki/Chaos_Monkey) situations to make sure our service is robust. While `@manta-style/helpers` will include more type to simulate `chaos monkey` situation (for example, simulate server errors), we can now use `Delay` to simulate server delay.

### Packages needed

Builder: `@manta-style/builder-typescript` or `@manta-style/builder-flowtype`

Mock: (None)

Package: `@manta-style/helpers`

### Config File

```typescript
import { Delay } from '@manta-style/helpers';

type UserInfo = {
  userid: number;
  userName: string;
  gender: 'male' | 'female';
};

export type GET = {
  '/getUserInfo': Delay<UserInfo, 5000> | UserInfo;
};
```

### Result

The output looks like the following, but server will randomly have 5-second delay.

```json
{
  "userid": 6.427734778350991,
  "userName": "This is a string message. Customize it mock plugins. (https://github.com/Cryrivers/manta-style/blob/master/documentation/Plugins.md)",
  "gender": "male"
}
```

## Proxy to real servers

### Packages needed

Builder: `@manta-style/builder-typescript` or `@manta-style/builder-flowtype`

Mock: (None)

Package: (None)

### Config File

```typescript
export type GET = {
  /**
   * @proxy https://jsonplaceholder.typicode.com
   */
  '/todos/1': { message: 'This is from Manta Style' };
  /**
   * @proxy https://www.google.com
   */
  '/errorExample': { haha: number };
};
```

### Result
