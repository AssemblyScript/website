---
description: An Array-like view on a raw binary buffer.
---

# TypedArray

An Array-like view on a raw binary buffer.

The TypedArray API works very much like JavaScript's \([MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray)\). The name `TypedArray` below represents one of the variants of element type `T` and is not an actual class.

## Variants

| Variant           | Element type | Description
| :---------------- | :----------: | :----------
| Int8Array         | i8           | A view on 8-bit signed integer values.
| Int16Array        | i16          | A view on 16-bit signed integer values.
| Int32Array        | i32          | A view on 32-bit signed integer values.
| Int64Array        | i64          | A view on 64-bit signed integer values.
| Uint8Array        | u8           | A view on 8-bit unsigned integer values.
| Uint8ClampedArray | u8           | A view on 8-bit unsigned integer values,<br />with set values clamped between `0` and `255` inclusive.
| Uint16Array       | u16          | A view on 16-bit unsigned integer values.
| Uint32Array       | u32          | A view on 32-bit unsigned integer values.
| Uint64Array       | u64          | A view on 64-bit unsigned integer values.
| Float32Array      | f32          | A view on 32-bit float values.
| Float64Array      | f64          | A view on 64-bit float values.

## Constructor

* ```ts
  new TypedArray<T>(length: i32)
  ```
  Constructs a new typed array view with a new backing buffer and all values initialized to zero. See `wrap` below for wrapping a raw buffer.

## Static members

* ```ts
  const BYTES_PER_ELEMENT: usize
  ```
  Number of bytes per element.

* ```ts
  function wrap(buffer: ArrayBuffer, byteOffset?: i32, length?: i32): TypedArray<T>
  ```
  Wraps a raw buffer to be viewed as a sequence of values of the typed array's value type. This is equivalent to the respective alternative constructor signature in JS but exists because there is no function overloading \(yet\).

## Instance members

### Fields

* ```ts
  readonly buffer: ArrayBuffer
  ```
  The backing array buffer of this view.

* ```ts
  readonly byteOffset: i32
  ```
  The offset in bytes from the start of the backing buffer.

* ```ts
  readonly byteLength: i32
  ```
  The length in bytes from the start of the backing buffer.

* ```ts
  readonly length: i32
  ```
  The length in elements.

### Methods

* ```ts
  function every(
    fn: (value: T, index: i32, self: TypedArray) => bool
  ): bool
  ```
  Calls the specified function with every value of the array until it finds the first value for which the function returns `false`. Returns `true` if all functions returned `true` or the array is empty, otherwise `false`.

* ```ts
  function fill(value: T, start?: i32, end?: i32): this
  ```
  Replaces the values of the array from `start` inclusive to `end` exclusive in place with the specified value, returning the array.

* ```ts
  function findIndex(
    fn: (value: T, index: i32, self: TypedArray) => bool
  ): i32
  ```
  Calls the specified function with every value of the array until it finds the first value for which the function returns `true`, returning its index. Returns `-1` if that's never the case.

* ```ts
  function forEach(
    fn: (value: T, index: i32, self: TypedArray) => void
  ): void
  ```
  Calls the specified function with every value of the array.

* ```ts
  function includes(value: T, fromIndex?: i32): bool
  ```
  Tests if the array includes the specified value, optionally providing a starting index.

* ```ts
  function indexOf(value: T, fromIndex?: i32): i32
  ```
  Gets the first index where the specified value can be found in the array. Returns `-1` if not found.

* ```ts
  function lastIndexOf(value: T, fromIndex?: i32): i32
  ```
  Gets the last index where the specified value can be found in the array. Returns `-1` if not found.

* ```ts
  function map(
    fn: (value: T, index: i32, self: TypedArray) => T
  ): TypedArray
  ```
  Calls the specified function with every value of the array, returning a new array of the function's return values.

* ```ts
  function reduce<U>(
    fn: (acc: U, cur: T, idx: i32, src: Array) => U,
    initialValue: U
  ): U
  ```
  Calls the specified reducer function with each value of the array, resulting in a single return value. The respective previous reducer function's return value is remembered in `acc`, starting with `initialValue`, becoming the final return value in the process.

* ```ts
  function reduceRight<U>(
    fn: (acc: U, cur: T, idx: i32, src: Array) => U,
    initialValue: U
  ): U
  ```
  Calls the specified reducer function with each value of the array, from right to left, resulting in a single return value.

* ```ts
  function reverse(): this
  ```
  Reverses an array's values in place, modifying the array before returning it.

* ```ts
  function some(
    fn: (value: T, index: i32, self: TypedArray) => bool
  ): bool
  ```
  Calls the specified function with every value of the array until it finds the first value for which the function returns `true`, returning `true`. Returns `false` otherwise or if the array is empty.

* ```ts
  function sort(fn: (a: T, b: T) => i32): this
  ```
  Sorts the values of the array in place, using the specified comparator function, modifying the array before returning it. The comparator returning a negative value means `a < b`, a positive value means `a > b` and `0` means that both are equal. Unlike in JavaScript, where an implicit conversion to strings is performed, the comparator defaults to compare two values of type `T`.

* ```ts
  function subarray(start?: i32, end?: i32): TypedArray
  ```
  Returns a new view on the array's backing buffer from `begin` inclusive to `end` exclusive relative to this array. If omitted, `end` defaults to the end of the array. Does not copy.
