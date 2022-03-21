---
description: Wrappers for basic numerical values.
---

# Number

Wrappers for basic numerical values.

The `Number` object has been split into one class per basic WebAssembly type as well. Unlike in JavaScript, these classes cannot have actual instances, hence it works a bit different than JavaScript's \([MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)\).

## Integers

The name `Number` below stands for one of the wrappers `I8`, `I16`, `I32`, `I64`, `U8`, `U16`, `U32` or `U64` representing their respective basic integer type `T`.

### Static members

* ```ts
  const MIN_VALUE: T
  ```
  The smallest representable value of the respective basic type. Differs from floating point values where it is the smallest representable positive value.

* ```ts
  const MAX_VALUE: T
  ```
  The largest representable value of the respective basic type.

* ```ts
  function parseInt(value: string, radix?: i32): T
  ```
  Parses a string to a value of the respective basic type.

### Instance members

* ```ts
  function toString(radix?: i32): string
  ```
  Returns the respective basic value converted to a string.

## Floats

The name `Number` below stands for one of the wrappers `F32` or `F64` representing their respective basic floating point type `T`.

### Static members

* ```ts
  const EPSILON: T
  ```
  The difference between `1.0` and the smallest number larger than `1.0`.

* ```ts
  const MAX_VALUE: T
  ```
  The largest representable positive value by the respective basic type.

* ```ts
  const MIN_VALUE: T
  ```
  The smallest representable positive value by the respective basic type.

* ```ts
  const MAX_SAFE_INTEGER: T
  ```
  The largest safe integer representable by the respective basic type.

* ```ts
  const MIN_SAFE_INTEGER: T
  ```
  The smallest safe integer representable by the respective basic type.

* ```ts
  const POSITIVE_INFINITY: T
  ```
  Positive infinity of the respective basic type.

* ```ts
  const NEGATIVE_INFINITY: T
  ```
  Negative infinity of the respective basic type.

* ```ts
  const NaN: T
  ```
  NaN \(Not A Number\) of the respective basic type.

* ```ts
  function isNaN(value: T): bool
  ```
  Tests if the value is `NaN`.

* ```ts
  function isFinite(value: T): bool
  ```
  Tests if the value is finite, that is not `NaN` , `POSITIVE_INFINITY` or `NEGATIVE_INFINITY.`

* ```ts
  function isInteger(value: T): bool
  ```
  Tests if the value is an integer.

* ```ts
  function isSafeInteger(value: T): bool
  ```
  Tests if the value is a safe integer.

* ```ts
  function parseInt(value: string, radix?: i32): T
  ```
  Parses a string to an integer value of the respective basic type.

* ```ts
  function parseFloat(value: string): T
  ```
  Parses a string to a float value of the respective basic type.

### Instance members

* ```ts
  function toString(radix?: i32): string
  ```
  Returns the respective basic value converted to a string. The `radix` parameter is currently ignored here.
