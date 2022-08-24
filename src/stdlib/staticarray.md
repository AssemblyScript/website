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
  function fromArray<T>(source: Array<T>): StaticArray<T>
  ```
  Creates a static array from a normal array.

* ```ts
  function concat<T>(source: StaticArray<T>, other: StaticArray<T>): StaticArray<T>
  ```
  ***Deprecated!*** Like the instance member `concat`, but taking and returning a `StaticArray`.

  Instead of `StaticArray.concat` better to use parametric `concat` instance method.

* ```ts
  function slice<T>(source: StaticArray<T>, start?: i32, end?: i32): StaticArray<T>
  ```
  ***Deprecated!*** Like the instance member `slice`, but returning a `StaticArray`.

  Instead of `StaticArray.slice` better to use parametric `slice` instance method.

## Instance members

### Fields

* ```ts
  readonly length: i32
  ```
  The fixed length of this static array.

### Methods

* ```ts
  function at(pos: i32): T
  ```
  Gets the element at the specified position. This method allows for positive and negative integers. Negative integers count back from the last element.

* ```ts
  function concat<U extends ArrayLike<T> = Array<T>>(other: U): U
  ```
  Concatenates the values of this static and the other normal array to a new normal array, in this order. Patameter `U` accepts `Array<T>` or `StaticArray<T>` types.

* ```ts
  function copyWithin(target: i32, start: i32, end?: i32): this
  ```
  Copies a region of an array's values over the respective values starting at the target location.

* ```ts
  function every(fn: (value: T, index: i32, self: StaticArray<T>) => bool): bool
  ```
  Calls the specified function with every value of the array until it finds the first value for which the function returns `false`. Returns `true` if all functions returned `true` or the array is empty, otherwise `false`.

* ```ts
  function fill(value: T, start?: i32, end?: i32): this
  ```
  Replaces the values of the array from `start` inclusive to `end` exclusive in place with the specified value, returning the array.

* ```ts
  function filter(fn: (value: T, index: i32, self: StaticArray<T>) => bool): Array<T>
  ```
  Calls the specified function with every value of the array, returning a new array with all values for which the function returned `true`.

* ```ts
  function findIndex(fn: (value: T, index: i32, self: StaticArray<T>) => bool): i32
  ```
  Calls the specified function with every value of the array until it finds the first value for which the function returns `true`, returning its index. Returns `-1` if that's never the case.

* ```ts
  function findLastIndex(fn: (value: T, index: i32, self: StaticArray<T>) => bool): i32;
  ```
  Calls the specified function with every value of the array starting at the end until it finds the first value for which the function returns `true`, returning its index. Returns `-1` if that's never the case.

* ```ts
  function forEach(fn: (value: T, index: i32, self: StaticArray<T>) => void): void
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
  function join(separator?: string): string
  ```
  Concatenates all values of the array to a string, separated by the specified separator \(default: `,`\).

* ```ts
  function lastIndexOf(value: T, fromIndex?: i32): i32
  ```
  Gets the last index where the specified value can be found in the array. Returns `-1` if not found.

* ```ts
  function map<U>(fn: (value: T, index: i32, self: StaticArray<T>) => U): Array<U>
  ```
  Calls the specified function with every value of the array, returning a new array of the function's return values.

* ```ts
  function slice<U extends ArrayLike<T> = Array<T>>(start?: i32, end?: i32): U
  ```
  Returns a shallow copy of this static array's values from `begin` inclusive to `end` exclusive, as a new normal array. If omitted, `end` defaults to the end of the array. Patameter `U` accepts `Array<T>` or `StaticArray<T>` types.

* ```ts
  function some(fn: (value: T, index: i32, self: StaticArray<T>) => bool): bool
  ```
  Calls the specified function with every value of the array until it finds the first value for which the function returns `true`, returning `true`. Returns `false` otherwise or if the array is empty.

* ```ts
  function sort(fn?: (a: T, b: T) => i32): this
  ```
  Sorts the values of the array in place, using the specified comparator function, modifying the array before returning it. The comparator returning a negative value means `a < b`, a positive value means `a > b` and `0` means that both are equal. Unlike in JavaScript, where an implicit conversion to strings is performed, the comparator defaults to compare two values of type `T`.

* ```ts
  function reduce<U>(
    fn: (accumValue: U, currentValue: T, index: i32, self: StaticArray<T>) => U,
    initialValue: U
  ): U
  ```
  Calls the specified reducer function with each value of the array, resulting in a single return value. The respective previous reducer function's return value is remembered in `accumValue`, starting with `initialValue`, becoming the final return value in the process.

* ```ts
  function reduceRight<U>(
    fn: (accumValue: U, currentValue: T, index: i32, self: StaticArray<T>) => U,
    initialValue: U
  ): U
  ```
  Calls the specified reducer function with each value of the array, from right to left, resulting in a single return value. See `Array#reduce` for the reducer function's signature.

* ```ts
  function reverse(): this
  ```
  Reverses an array's values in place, modifying the array before returning it.

* ```ts
  function toString(): string
  ```
  Returns the result of `join()`.
