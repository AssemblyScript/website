---
description: Mathematical operations as known from JavaScript.
---

# Math

Mathematical operations as known from JavaScript.

The Math API is very much like JavaScript's \([MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math)\), with the notable exceptions stated above and rest parameters not being supported yet.

## Variants

Math in AssemblyScript is available in multiple variants.

| Variant     | Description
| :---------- | :----------
| NativeMath  | WebAssembly implementation for `f64`
| NativeMathf | WebAssembly implementation for `f32`
| JSMath      | JavaScript implementation for `f64` (imported from the host)

By default, the global `Math` object is an alias of `NativeMath` and `Mathf` is an alias of `NativeMathf` .

### Using JSMath

By default, the compiler utilizes `NativeMath` which is implemented in WebAssembly directly, but where small module size is more important than performance, one can opt to override the default by adding `--use Math=JSMath` on the command line, essentially aliasing `Math` with `JSMath` instead, which maps to an import of the browser's math implementation. Naturally, this option requires importing the browser's `Math` object as a whole, but does not require seeding / is not seedable. Generated bindings automatically take care of importing the browser's math in this scenario.

## Static members

The type `T` below substitutes either `f32` or `f64` depending on the implementation used. Note that `Math` is not actually generic, but concrete implementations like `Math` and `Mathf` have an identical interface that only differs in the implementation's floating-point precision denoted by `T`.

### Constants

* ```ts
  const E: T
  ```
  The base of natural logarithms, e, approximately 2.718.

* ```ts
  const LN2: T
  ```
  The natural logarithm of 2, approximately 0.693.

* ```ts
  const LN10: T
  ```
  The natural logarithm of 10, approximately 2.302.

* ```ts
  const LOG2E: T
  ```
  The base 2 logarithm of e, approximately 1.442.

* ```ts
  const LOG10E: T
  ```
  The base 10 logarithm of e, approximately 0.434.

* ```ts
  const PI: T
  ```
  The ratio of the circumference of a circle to its diameter, approximately 3.14159.

* ```ts
  const SQRT1_2: T
  ```
  The square root of 1/2, approximately 0.707.

* ```ts
  const SQRT2: T
  ```
  The square root of 2, approximately 1.414.

### Functions

* ```ts
  function abs(x: T): T
  ```
  Returns the absolute value of `x`.

* ```ts
  function acos(x: T): T
  ```
  Returns the arccosine \(in radians\) of `x`.

* ```ts
  function acosh(x: T): T
  ```
  Returns the hyperbolic arc-cosine of `x`.

* ```ts
  function asin(x: T): T
  ```
  Returns the arcsine \(in radians\) of `x.`

* ```ts
  function asinh(x: T): T
  ```
  Returns the hyperbolic arcsine of `x`.

* ```ts
  function atan(x: T): T
  ```
  Returns the arctangent \(in radians\) of `x`.

* ```ts
  function atan2(y: T, x: T): T
  ```
  Returns the arctangent of the quotient of its arguments.

* ```ts
  function atanh(x: T): T
  ```
  Returns the hyperbolic arctangent of `x`.

* ```ts
  function cbrt(x: T): T
  ```
  Returns the cube root of `x`.

* ```ts
  function ceil(x: T): T
  ```
  Returns the smallest integer greater than or equal to `x`.

* ```ts
  function clz32(x: T): T
  ```
  Returns the number of leading zero bits in the 32-bit binary representation of `x`.

* ```ts
  function cos(x: T): T
  ```
  Returns the cosine \(in radians\) of `x`.

* ```ts
  function cosh(x: T): T
  ```
  Returns the hyperbolic cosine of `x`.

* ```ts
  function exp(x: T): T
  ```
  Returns e to the power of `x`.

* ```ts
  function expm1(x: T): T
  ```
  Returns e to the power of `x`, minus 1.

* ```ts
  function floor(x: T): T
  ```
  Returns the largest integer less than or equal to `x`.

* ```ts
  function fround(x: T): T
  ```
  Returns the nearest 32-bit single precision float representation of `x`.

* ```ts
  function hypot(value1: T, value2: T): T
  ```
  Returns the square root of the sum of squares of its arguments.

* ```ts
  function imul(a: T, b: T): T
  ```
  Returns the result of the C-like 32-bit multiplication of `a` and `b`.

* ```ts
  function log(x: T): T
  ```
  Returns the natural logarithm \(base e\) of `x`.

* ```ts
  function log10(x: T): T
  ```
  Returns the base 10 logarithm of `x`.

* ```ts
  function log1p(x: T): T
  ```
  Returns the natural logarithm \(base e\) of 1 + `x`.

* ```ts
  function log2(x: T): T
  ```
  Returns the base 2 logarithm of `x`.

* ```ts
  function max(value1: T, value2: T): T
  ```
  Returns the largest-valued number of its arguments.

* ```ts
  function min(value1: T, value2: T): T
  ```
  Returns the lowest-valued number of its arguments.

* ```ts
  function pow(base: T, exponent: T): T
  ```
  Returns `base` to the power of `exponent`.

* ```ts
  function random(): T
  ```
  Returns a pseudo-random number in the range from 0.0 inclusive up to but not including 1.0.

  Note that `Math.random` needs a way to seed the random number generator, which is achieved with a [special import](../concepts.md#special-imports) `env.seed` returning the seed as an `f64` value. Generated bindings and WASI take care of it automatically.

* ```ts
  function round(x: T): T
  ```
  Returns the value of `x` rounded to the nearest integer.

* ```ts
  function sign(x: T): T
  ```
  Returns the sign of `x`, indicating whether the number is positive, negative or zero.

* ```ts
  function signbit(x: T): bool
  ```
  Returns whether the sign bit of `x` is set.

* ```ts
  function sin(x: T): T
  ```
  Returns the sine of `x`.

* ```ts
  function sinh(x: T): T
  ```
  Returns the hyperbolic sine of `x`.

* ```ts
  function sqrt(x: T): T
  ```
  Returns the square root of `x`.

* ```ts
  function tan(x: T): T
  ```
  Returns the tangent of `x`.

* ```ts
  function tanh(x: T): T
  ```
  Returns the hyperbolic tangent of `x`.

* ```ts
  function trunc(x: T): T
  ```
  Returns the integer part of `x` by removing any fractional digits.

## Considerations

The Math implementations are meant as a drop-in replacement for JavaScript's `Math` with all its quirks. For example, `Math.round` always rounds towards `+Infinity` and `Math.imul` and similar functions operate on `number`, which is `f64` in AssemblyScript. Hence, using [WebAssembly's math instructions](./globals.md#math) directly where possible is often more efficient.
