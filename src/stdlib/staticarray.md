---
description: A randomly accessible sequence of values of a generic type with a fixed length.
---

# StaticArray

A randomly accessible sequence of values of a generic type with a fixed length.

The StaticArray API is similar to the [Array API](./array.md), with the important difference that it has a fixed length that cannot change. Unlike a normal Array, a StaticArray does not have a separate backing buffer, so no level of indirection, and as such can have minimal overhead and performance characteristics very similar to arrays in C.

## Constructor

* ```ts
  new StaticArray<T>(length: i32)
  ```
  Constructs a new static array.

## Static members

* ```ts
  function fromArray<T>(source: T[]): StaticArray<T>
  ```
  Creates a static array from a normal array.

* ```ts
  function concat<T>(source: StaticArray<T>, other: StaticArray<T>): StaticArray<T>
  ```
  Like the instance member `concat`, but taking and returning a `StaticArray`.

* ```ts
  function slice<T>(source: StaticArray<T>, start?: i32, end?: i32): StaticArray<T>
  ```
  Like the instance member `slice`, but returning a `StaticArray`.

## Instance members

### Fields

* ```ts
  readonly length: i32
  ```
  The fixed length of this static array.

### Methods

* ```ts
  function concat(other: T[]): T[]
  ```
  Concatenates the values of this static and the other normal array to a new normal array, in this order.

* ```ts
  function includes(value: T, fromIndex?: i32): bool
  ```
  Tests if the array includes the specified value, optionally providing a starting index.

* ```ts
  function indexOf(value: T, fromIndex?: i32): i32
  ```
  Gets the first index where the specified value can be found in the array. Returns `-1` if not found.

* ```ts
  function join(separator?: string): string
  ```
  Concatenates all values of the array to a string, separated by the specified separator \(default: `,`\).

* ```ts
  function lastIndexOf(value: T, fromIndex?: i32): i32
  ```
  Gets the last index where the specified value can be found in the array. Returns `-1` if not found.

* ```ts
  function slice(start?: i32, end?: i32): T[]
  ```
  Returns a shallow copy of this static array's values from `begin` inclusive to `end` exclusive, as a new normal array. If omitted, `end` defaults to the end of the array.

* ```ts
  function toString(): string
  ```
  Returns the result of `join()`.
