# @manta-style/mock-iterate

## Installation

```sh
$ npm install --save-dev @manta-style/mock-iterate
```

## Usage

```js
/**
 *
 * @iterate 'Happy'
 * @iterate 'Birthday'
 * @iterate 'To'
 * @iterate 'You'
 *
 */
message: string;
```

- Every call will generate the next message
- First call will return `'Happy'`, then `'Birthday'`, then `'To'`, then `'Yout'`, then back to `'Happy'` again.
