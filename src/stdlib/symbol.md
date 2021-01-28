---
description: A unique symbol.
---

# Symbol

A primitive data type representing a unique global symbol.

The symbol type is very similar to JavaScript's \([MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol)\), but is not deeply integrated with the compiler yet.

## Construction

* ```ts
  function Symbol(description?: string): symbol
  ```
  Creates a new unique symbol. Note that this is not a constructor (symbols are primitive data types) so cannot be invoked with `new`.

## Static members

* ```ts
  function for(key: string): symbol
  ```
  Obtains the existing unique symbol for the specified global key or creates a new unique symbol if the key does not exist.

* ```ts
  function keyFor(sym: symbol): string | null
  ```
  Obtains the global key of the specified unique symbol, if any.

## Instance members

* ```ts
  function toString(): string
  ```
  Returns a string representation of the symbol of the form `"Symbol(key?)"`.
