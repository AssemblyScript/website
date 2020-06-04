---
description: A set of unique generic values.
---

# Set

A set of unique generic values.

The Set API is very similar to JavaScript's \([MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set)\), but iterators are not implemented yet.

## Constructor

* ```ts
  new Set<T>()
  ```
  Constructs a new set of unique value of type `T`.

## Instance members

### Fields

* ```ts
  readonly size: i32
  ```
  The current number of unique values in the set.

### Methods

* ```ts
  function add(value: T): void
  ```
  Adds the specified value to the set. Does nothing if the value already exists.

* ```ts
  function delete(value: T): bool
  ```
  Deletes the specified value. Returns `true` if the value was found, otherwise `false`.

* ```ts
  function clear(): void
  ```
  Clears the set, deleting all values.

* ```ts
  function has(value: T): bool
  ```
  Tests if the specified value exists in the set.

* ```ts
  function values(): Array<T>
  ```
  Gets the values contained in this set as an array, in insertion order. This is preliminary while iterators are not supported.

* ```ts
  function toString(): string
  ```
  Returns a string representation of this map.
