---
description: A fixed-length raw binary buffer.
---

# ArrayBuffer

A fixed-length raw binary buffer.

The ArrayBuffer API is exactly as in JavaScript \([MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)\).

## Constructor

* ```ts
  new ArrayBuffer(length: i32)
  ```
  Constructs a new buffer of the given length in bytes.

## Static members

* ```ts
  function isView<T>(value: T): bool
  ```
  Returns true if `value` is one of the buffer views, such as one of the [typed arrays](./typedarray.md) or a [DataView](./dataview.md).

## Instance members

### Fields

* ```ts
  readonly byteLength: i32
  ```
  The buffer's length, in bytes.

### Methods

* ```ts
  function slice(begin?: i32, end?: i32): ArrayBuffer
  ```
  Returns a copy of this buffer from begin, inclusive, up to end, exclusive.

* ```ts
  function toString(): string
  ```
  Returns a string representation of this buffer.
