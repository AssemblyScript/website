---
description: Special features that exist for internal implementation purposes or are otherwise nice to have.
---

# Peculiarities

Special features that exist for internal implementation purposes or are otherwise nice to have.

## Annotations

Decorators work more like actual compiler annotations in AssemblyScript.

| Annotation          | Description
| :------------------ | :----------
| `@inline`           | Requests inlining of a constant or function.
| `@lazy`             | Requests lazy compilation of a variable. Useful to avoid unnecessary globals.
| `@global`           | Registers an element to be part of the global scope.
| `@final`            | Annotates a class as non-subclassed.
| `@unmanaged`        | Annotates a class as not tracked by GC, essentially C structs.
| `@external`         | Changes the external name of an imported element. `@external(module, name)` changes both the module and element name, `@external(name)` changes the element name only.
| `@operator`         | Annotates a method as a binary operator overload. See below.
| `@operator.binary`  | Alias of `@operator`.
| `@operator.prefix`  | Annotates a method as a unary prefix operator overload. See below.
| `@operator.postfix` | Annotates a method as a unary postfix operator overload. See below.

Custom decorators can be given meaning by using a [transform](./transforms.md).

## Operator overloads

Operator overloads can only be used on class methods. The respective argument types must match the class type.

### Binary operations

```ts
@operator(OP)
static __op(left: T, right :T): T { ... }

@operator(OP)
__op(right: T): T  { ... }
```

| OP      | Description
| :------ | :----------
| `"[]"`  | Checked indexed get
| `"[]="` | Checked indexed set
| `"{}"`  | Unchecked indexed get
| `"{}="` | Unchecked indexed set
| `"=="`  | Equality
| `"!="`  | Inequality
| `">"`   | Greater than
| `">="`  | Greater than or equal
| `"<"`   | Less than
| `"<="`  | Less than or equal
| `">>"`  | Arithmetic right shift
| `">>>"` | Logical right shift
| `"<<"`  | Left shift
| `"&"`   | Bitwise AND
| `"|"`   | Bitwise OR
| `"^"`   | Bitwise XOR
| `"+"`   | Addition
| `"-"`   | Subtraction
| `"*"`   | Multiplication
| `"/"`   | Division
| `"**"`  | Exponentiation
| `"%"`   | Remainder

The `===` operation cannot be overloaded \(is identity equality\).

### Unary prefix operations

```ts
@operator.prefix(OP)
static __op(self: T): T { ... }

@operator.prefix(OP)
__op(): T { ... }
```

| OP     | Description      | Notes
| :----- | :--------------- | :-----
| `"!"`  | Logical NOT      |
| `"~"`  | Bitwise NOT      |
| `"+"`  | Unary plus       |
| `"-"`  | Unary negation   |
| `"++"` | Prefix increment | Instance overload reassigns
| `"--"` | Prefix decrement | Instance overload reassigns

::: tip
Note that increment and decrement overloads can have slightly different semantics. If the overload is declared as an instance method, on `++a` the compiler does emit code that reassigns the resulting value to `a` while if the overload is declared static, the overload behaves like any other overload, skipping the otherwise implicit assignment.
:::

### Unary postfix operations

```ts
@operator.postfix(OP)
static __op(self: T): T { ... }

@operator.postfix(OP)
__op(): T { ... }
```

| OP     | Description       | Notes
| :----- | :---------------- | :---
| `"++"` | Postfix increment | Instance overload reassigns
| `"--"` | Postfix decrement | Instance overload reassigns

::: tip
Overloaded postfix operations do not preserve the original value automatically.
:::

## Range limits

The following range limits are present as global constants for convenience:

* ```ts
  const i8.MIN_VALUE: i8 = -128
  const i8.MAX_VALUE: i8 = 127
  ```

* ```ts
  const i16.MIN_VALUE: i16 = -32768
  const i16.MAX_VALUE: i16 = 32767
  ```

* ```ts
  const i32.MIN_VALUE: i32 = -2147483648
  const i32.MAX_VALUE: i32 = 2147483647
  ```

* ```ts
  const i64.MIN_VALUE: i64 = -9223372036854775808
  const i64.MAX_VALUE: i64 = 9223372036854775807
  ```

* ```ts
  const isize.MIN_VALUE: isize // WASM32: i32.MIN_VALUE, WASM64: i64.MIN_VALUE
  const isize.MAX_VALUE: isize // WASM32: i32.MAX_VALUE, WASM64: i64.MAX_VALUE
  ```

* ```ts
  const u8.MIN_VALUE: u8 = 0
  const u8.MAX_VALUE: u8 = 255
  ```

* ```ts
  const u16.MIN_VALUE: u16 = 0
  const u16.MAX_VALUE: u16 = 65535
  ```

* ```ts
  const u32.MIN_VALUE: u32 = 0
  const u32.MAX_VALUE: u32 = 4294967295
  ```

* ```ts
  const u64.MIN_VALUE: u64 = 0
  const u64.MAX_VALUE: u64 = 18446744073709551615
  ```

* ```ts
  const usize.MIN_VALUE: usize = 0
  const usize.MAX_VALUE: usize // WASM32: u32.MAX_VALUE, WASM64: u64.MAX_VALUE
  ```

* ```ts
  const bool.MIN_VALUE: bool = 0
  const bool.MAX_VALUE: bool = 1
  ```

* ```ts
  const f32.MIN_VALUE: f32 = -3.40282347e+38
  const f32.MAX_VALUE: f32 = 3.40282347e+38
  const f32.MIN_SAFE_INTEGER: f32 = -16777215
  const f32.MAX_SAFE_INTEGER: f32 = 16777215
  const f32.EPSILON: f32 = 1.19209290e-07
  ```

* ```ts
  const f64.MIN_VALUE: f64 = -1.7976931348623157e+308
  const f64.MAX_VALUE: f64 = 1.7976931348623157e+308
  const f64.MIN_SAFE_INTEGER: f64 = -9007199254740991
  const f64.MAX_SAFE_INTEGER: f64 = 9007199254740991
  const f64.EPSILON: f64 = 2.2204460492503131e-16
  ```

## Tree-shaking

### Module-level

The compiler only compiles elements reachable from the entry file and ignores everything that remains unused. This is very similar to a JavaScript VM's behavior when running a JavaScript file, but unlike in TypeScript it also affects checking of types. Helps to reduce compilation times and binary sizes significantly.

### Branch-level

In addition to module-level tree-shaking, the compiler ignores branches that it can prove won't be taken. Works with constants, built-ins that compile to a constant, expressions that can be precomputed to a constant, plus the following globals to detect specific compiler flags or features:

* ```ts
  const ASC_TARGET: i32
  ```
  Indicates the compilation target. Possible values are 0 = JS (portable), 1 = WASM32, 2 = WASM64.

* ```ts
  const ASC_NO_ASSERT: bool
  ```
  Whether `--noAssert` has been set.

* ```ts
  const ASC_MEMORY_BASE: usize
  ```
  The value of `--memoryBase`.

* ```ts
  const ASC_OPTIMIZE_LEVEL: i32
  ```
  The value of `--optimizeLevel`. Possible values are 0, 1, 2 and 3.

* ```ts
  const ASC_SHRINK_LEVEL: i32
  ```
  The value of `--shrinkLevel`. Possible values are 0, 1 and 2.

* ```ts
  const ASC_LOW_MEMORY_LIMIT: i32
  ```
  The value of `--lowMemoryLimit`.

* ```ts
  const ASC_EXPORT_RUNTIME: i32
  ```
  Whether `--exportRuntime` has been set.

* ```ts
  const ASC_FEATURE_SIGN_EXTENSION: bool
  const ASC_FEATURE_MUTABLE_GLOBALS: bool
  const ASC_FEATURE_NONTRAPPING_F2I: bool
  const ASC_FEATURE_BULK_MEMORY: bool
  const ASC_FEATURE_SIMD: bool
  const ASC_FEATURE_THREADS: bool
  const ASC_FEATURE_EXCEPTION_HANDLING: bool
  const ASC_FEATURE_TAIL_CALLS: bool
  const ASC_FEATURE_REFERENCE_TYPES: bool
  const ASC_FEATURE_MULTI_VALUE: bool
  const ASC_FEATURE_GC: bool
  const ASC_FEATURE_MEMORY64: bool
  ```
  Whether the respective feature is enabled.

  For example, if a library supports SIMD but also wants to provide a fallback when being compiled without SIMD support:

  ```ts
  if (ASC_FEATURE_SIMD) {
    // compute with SIMD operations
  } else {
    // fallback without SIMD operations
  }
  ```

* ```ts
  const ASC_WASI: i32
  ```
  A constant only being defined when WASI bindings are used via `import "wasi"`. Can be checked with `isDefined(ASC_WASI)`.
