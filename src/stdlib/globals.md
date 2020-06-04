---
description: JavaScript-like elements in the global scope.
---

# Globals

In addition to the [general environment with its WebAssembly-focused built-ins](../basics/environment.md), the following global constants and functions are present alongside the standard library's classes.

## Constants

* ```ts
  const NaN: auto // f32 or f64
  ```
  Not a number as a 32-bit or 64-bit float depending on context. Compiles to a constant.

* ```ts
  const Infinity: auto // f32 or f64
  ```
  Positive infinity as a 32-bit or 64-bit float depending on context. Compiles to a constant.

## Functions

* ```ts
  function isNaN<T>(value: T): bool
  ```
  Tests if a 32-bit or 64-bit float is `NaN`.

* ```ts
  function isFinite<T>(value: T): bool
  ```
  Tests if a 32-bit or 64-bit float is finite, that is not `NaN` or +/-`Infinity`.

* ```ts
  function parseInt(str: string, radix?: i32): i64
  ```
  Parses a string to a 64-bit integer. Returns `0` on invalid inputs.

* ```ts
  function parseFloat(str: string): f64
  ```
  Parses a string to a 64-bit float. Returns `NaN` on invalid inputs.
