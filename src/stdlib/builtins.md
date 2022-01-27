---
description: Direct access to WebAssembly and compiler features.
sidebarDepth: 2
---

# Builtins

The following builtins provide direct access to WebAssembly and compiler features. They form the low-level foundation of the standard library, for example, while also being available for everyone to utilize where directly tapping into WebAssembly or the compiler is desired.

## Static type checks

By making use of the following special type checks, especially in generic contexts, untaken branches can be eliminated statically, leading to concrete WebAssembly functions that handle one type specificially.

* ```ts
  function isInteger<T>(value?: T): bool
  ```
  Tests if the specified type _or_ expression is of an integer type and not a reference. Compiles to a constant.

* ```ts
  function isFloat<T>(value?: T): bool
  ```
  Tests if the specified type _or_ expression is of a float type. Compiles to a constant.

* ```ts
  function isSigned<T>(value?: T): bool
  ```
  Tests if the specified type _or_ expression can represent negative numbers. Compiles to a constant.

* ```ts
  function isReference<T>(value?: T): bool
  ```
  Tests if the specified type _or_ expression is of a reference type. Compiles to a constant.

* ```ts
  function isString<T>(value?: T): bool
  ```
  Tests if the specified type _or_ expression can be used as a string. Compiles to a constant.

* ```ts
  function isArray<T>(value?: T): bool
  ```
  Tests if the specified type _or_ expression can be used as an array. Compiles to a constant.

* ```ts
  function isFunction<T>(value?: T): bool
  ```
  Tests if the specified type _or_ expression is of a function type. Compiles to a constant.

* ```ts
  function isNullable<T>(value?: T): bool
  ```
  Tests if the specified type _or_ expression is of a nullable reference type. Compiles to a constant.

* ```ts
  function isDefined(expression: auto): bool
  ```
  Tests if the specified expression resolves to a defined element. Compiles to a constant.

* ```ts
  function isConstant(expression: auto): bool
  ```
  Tests if the specified expression evaluates to a constant value. Compiles to a constant.

* ```ts
  function isManaged<T>(expression: auto): bool
  ```
  Tests if the specified type _or_ expression is of a managed type. Compiles to a constant. Usually only relevant when implementing custom collection-like classes.

### Example

```ts
function add<T>(a: T, b: T): T {
  return a + b // addition if numeric, string concatenation if a string
}

function add<T>(a: T, b: T): T {
  if (isString<T>()) { // eliminated if T is not a string
    return parseInt(a) + parseInt(b)
  } else { // eliminated if T is a string
    return a + b
  }
}
```

::: tip
If you are not going to use low-level WebAssembly in the foreseeable future, feel free to come back to the following paragraphs at a later time and continue at the next page[ ](./loader.md)right away.
:::

## Utility

* ```ts
  function sizeof<T>(): usize
  ```
  Determines the byte size of the respective _basic type_. Means: If `T` is a class type, the size of `usize` is returned. To obtain the size of a class in memory, use `offsetof<T>()` instead. Compiles to a constant.

* ```ts
  function offsetof<T>(fieldName?: string): usize
  ```
  Determines the offset of the specified field within the given class type. Returns the class type's end offset \(means: where the next field would be located, before alignment\) if field name has been omitted. Compiles to a constant. The `fieldName` argument must be a compile-time constant `string` because there is no information about field names anymore in the final binary. Hence, the field's name must be known at the time the returned constant is computed.

* ```ts
  function alignof<T>(): usize
  ```
  Determines the alignment \(log2\) of the specified underlying _basic type_. Means: If `T` is a class type, the alignment of `usize` is returned. Compiles to a constant.

* ```ts
  function assert<T>(isTrueish: T, message?: string): T
  ```
  Traps if the specified value is not true-ish, otherwise returns the non-nullable value. Like assertions in C, aborting the entire program if the expectation fails, with the `--noAssert` option to disable all assertions in production.

* ```ts
  function instantiate<T>(...args: auto[]): T
  ```
  Instantiates a new instance of `T` using the specified constructor arguments.

* ```ts
  function changetype<T>(value: auto): T
  ```
  Changes the type of a value to another one. Useful for casting class instances to their pointer values and vice-versa.

* ```ts
  function idof<T>(): u32
  ```
  Obtains the computed unique id of a class type. Usually only relevant when allocating objects or dealing with RTTI externally.

* ```ts
  function nameof<T>(value?: T): string
  ```
  Determines the name of a given type.

* ```ts
  function bswap<T>(value: T): T
  ```
  Reverses the byte order of the specified integer.

* ```ts
  function bswap16<T>(value: T): T
  ```
  Reverses only the last 2 bytes regardless of the type argument.

## WebAssembly

### Math

The following generic built-ins compile to WebAssembly instructions directly.

* ```ts
  function clz<T>(value: T): T
  ```
  <details><summary>Performs the sign-agnostic count leading zero bits operation on a 32-bit or 64-bit integer. All zero bits are considered leading if the value is zero.</summary>

  | T                                | Instruction
  |----------------------------------|-------------
  | i8, u8, i16, u16, i32, u32, bool | i32.clz
  | i64, u64                         | i64.clz
  </details>

* ```ts
  function ctz<T>(value: T): T
  ```
  <details><summary>Performs the sign-agnostic count tailing zero bits operation on a 32-bit or 64-bit integer. All zero bits are considered trailing if the value is zero.</summary>

  | T                                | Instruction
  |----------------------------------|-------------
  | i8, u8, i16, u16, i32, u32, bool | i32.ctz
  | i64, u64                         | i64.ctz
  </details>

* ```ts
  function popcnt<T>(value: T): T
  ```
  <details><summary>Performs the sign-agnostic count number of one bits operation on a 32-bit or 64-bit integer.</summary>

  | T                          | Instruction
  |----------------------------|-------------
  | i8, u8, i16, u16, i32, u32 | i32.popcnt
  | i64, u64                   | i64.popcnt
  | bool                       | *none*
  </details>

* ```ts
  function rotl<T>(value: T, shift: T): T
  ```
  <details><summary>Performs the sign-agnostic rotate left operation on a 32-bit or 64-bit integer.</summary>

  | T                | Instruction
  |------------------|-------------
  | i32, u32         | i32.rotl
  | i64, u64         | i64.rotl
  | i8, u8, i16, u16 | *emulated*
  | bool             | *none*
  </details>

* ```ts
  function rotr<T>(value: T, shift: T): T
  ```
  <details><summary>Performs the sign-agnostic rotate right operation on a 32-bit or 64-bit integer.</summary>

  | T                | Instruction
  |------------------|-------------
  | i32, u32         | i32.rotr
  | i64, u64         | i64.rotr
  | i8, u8, i16, u16 | *emulated*
  | bool             | *none*
  </details>

* ```ts
  function abs<T>(value: T): T
  ```
  <details><summary>Computes the absolute value of an integer or float.</summary>

  | T                       | Instruction
  |-------------------------|-------------
  | f32                     | f32.abs
  | f64                     | f64.abs
  | i8, i16, i32, i64       | *emulated*
  | u8, u16, u32, u64, bool | *none*
  </details>

* ```ts
  function max<T>(left: T, right: T): T
  ```
  <details><summary>Determines the maximum of two integers or floats. If either operand is <code>NaN</code>, returns <code>NaN</code>.</summary>

  | T                                          | Instruction
  |--------------------------------------------|-------------
  | f32                                        | f32.max
  | f64                                        | f64.max
  | i8, u8, i16, u16, i32, u32, i64, u64, bool | *emulated*
  </details>

* ```ts
  function min<T>(left: T, right: T): T
  ```
  <details><summary>Determines the minimum of two integers or floats. If either operand is <code>NaN</code>, returns <code>NaN</code>.</summary>

  | T                                          | Instruction
  |--------------------------------------------|-------------
  | f32                                        | f32.min
  | f64                                        | f64.min
  | i8, u8, i16, u16, i32, u32, i64, u64, bool | *emulated*
  </details>

* ```ts
  function ceil<T>(value: T): T
  ```
  <details><summary>Performs the ceiling operation on a 32-bit or 64-bit float.</summary>

  | T                                          | Instruction
  |--------------------------------------------|-------------
  | f32                                        | f32.ceil
  | f64                                        | f64.ceil
  | i8, u8, i16, u16, i32, u32, i64, u64, bool | *none*
  </details>

* ```ts
  function floor<T>(value: T): T
  ```
  <details><summary>Performs the floor operation on a 32-bit or 64-bit float.</summary>

  | T                                          | Instruction
  |--------------------------------------------|-------------
  | f32                                        | f32.floor
  | f64                                        | f64.floor
  | i8, u8, i16, u16, i32, u32, i64, u64, bool | *none*
  </details>

* ```ts
  function copysign<T>(x: T , y: T): T
  ```
  <details><summary>Composes a 32-bit or 64-bit float from the magnitude of <code>x</code> and the sign of <code>y</code>.</summary>

  | T   | Instruction
  |-----|-------------
  | f32 | f32.copysign
  | f64 | f64.copysign
  </details>

* ```ts
  function nearest<T>(value: T): T
  ```
  <details><summary>Rounds to the nearest integer tied to even of a 32-bit or 64-bit float.</summary>

  | T                                          | Instruction
  |--------------------------------------------|-------------
  | f32                                        | f32.nearest
  | f64                                        | f64.nearest
  | i8, u8, i16, u16, i32, u32, i64, u64, bool | *none*
  </details>

* ```ts
  function reinterpret<TTo>(value: auto): T
  ```
  <details><summary>Reinterprets the bits of the specified value as type <code>T</code>.</summary>

  | TTo      | Instruction
  |----------|-------------
  | i32, u32 | i32.reinterpret_f32
  | i64, u64 | i64.reinterpret_f64
  | f32      | f32.reinterpret_i32
  | f64      | f64.reinterpret_i64
  </details>

* ```ts
  function sqrt<T>(value: T): T
  ```
  <details><summary>Calculates the square root of a 32-bit or 64-bit float.</summary>

  | T   | Instruction
  |-----|-------------
  | f32 | f32.sqrt
  | f64 | f64.sqrt
  </details>

* ```ts
  function trunc<T>(value: T): T
  ```
  <details><summary>Rounds to the nearest integer towards zero of a 32-bit or 64-bit float.</summary>

  | T                                          | Instruction
  |--------------------------------------------|-------------
  | f32                                        | f32.trunc
  | f64                                        | f64.trunc
  | i8, u8, i16, u16, i32, u32, i64, u64, bool | *none*
  </details>

### Memory

Similarly, the following built-ins emit WebAssembly instructions accessing or otherwise modifying memory.

* ```ts
  function load<T>(ptr: usize, immOffset?: usize, immAlign?: usize): T
  ```
  <details><summary>Loads a value of the specified type from memory. Equivalent to dereferencing a pointer in other languages.</summary>

  | T        | Instruction  | If context is i64
  |----------|--------------|-------------------
  | i8       | i32.load8_s  | i64.load8_s
  | u8       | i32.load8_u  | i64.load8_u
  | i16      | i32.load16_s | i64.load16_s
  | u16      | i32.load16_u | i64.load16_u
  | i32      | i32.load     | i64.load32_s
  | u32      | i32.load     | i64.load32_u
  | i64, u64 | i64.load     | *n/a*
  | f32      | f32.load     | *n/a*
  | f64      | f64.load     | *n/a*
  | \<ref>   | i32/i64.load | *n/a*
  </details>

* ```ts
  function store<T>(ptr: usize, value: auto, immOffset?: usize, immAlign?: usize): void
  ```
  <details><summary>Stores a value of the specified type to memory. Equivalent to dereferencing a pointer in other languages and assigning a value.</summary>

  | T        | Instruction   | If value is i64
  |----------|---------------|-----------------
  | i8, u8   | i32.store8    | i64.store8
  | i16, u16 | i32.store16   | i64.store16
  | i32, u32 | i32.store     | i64.store32
  | i64, u64 | i64.store     | *n/a*
  | f32      | f32.store     | *n/a*
  | f64      | f64.store     | *n/a*
  | \<ref>   | i32/i64.store | *n/a*
  </details>

  ::: warning
  `immOffset` and `immAlign` arguments in `load` and `store` should be non-negative constant values. See more details in [rationale](https://github.com/WebAssembly/design/blob/main/Rationale.md#loadstore-addressing)
  :::

* ```ts
  function memory.size(): i32
  ```
  Returns the current size of the memory in units of pages. One page is 64kb.

* ```ts
  function memory.grow(value: i32): i32
  ```
  Grows linear memory by a given unsigned delta of pages. One page is 64kb. Returns the previous size of the memory in units of pages or `-1` on failure.

  ::: warning
  Calling `memory.grow` where a memory manager is present might break it.
  :::

* ```ts
  function memory.copy(dst: usize, src: usize, n: usize): void
  ```
  Copies `n` bytes from `src` to `dst` . Regions may overlap. Emits the respective instruction if bulk-memory is enabled, otherwise ships a polyfill.

* ```ts
  function memory.fill(dst: usize, value: u8, n: usize): void
  ```
  Fills `n` bytes at `dst` with the given byte `value`. Emits the respective instruction if bulk-memory is enabled, otherwise ships a polyfill.

* ```ts
  function memory.repeat(dst: usize, src: usize, srcLength: usize, count: usize): void
  ```
  Repeats a sequence of bytes given as `src` with `srcLength` `count` times into destination `dst`.

* ```ts
  function memory.compare(lhs: usize, rhs: usize, n: usize): i32
  ```
  Compares the first `n` bytes of `left` and `rigth` and returns a value that indicates their relationship:
  - **Negative** value if the first differing byte in `lhs` is less than the corresponding byte in `rhs`.
  - **Positive** value if the first differing byte in `lhs` is greater than the corresponding byte in `rhs`.
  - **Zero​** if all `n` bytes of `lhs` and `rhs` are equal.

* ```ts
  function memory.data(size: i32, align?: i32): usize
  ```
  Gets a pointer to a zeroed static chunk of memory of the given size. Alignment defaults to `16`. Arguments must be compile-time constants.

* ```ts
  function memory.data<T>(values: T[], align?: i32): usize
  ```
  Gets a pointer to a pre-initialized static chunk of memory. Alignment defaults to the size of `T`. Arguments must be compile-time constants.

The `immOffset` argument is a bit special here, because it becomes an actual immediate of the respective WebAssembly instruction instead of a normal operand. Thus it must be provided as a compile time constant value. This can be a literal or the value of a `const` variable that the compiler can precompute.

### Control flow

* ```ts
  function select<T>(ifTrue: T, ifFalse: T, condition: bool): T
  ```
  Selects one of two pre-evaluated values depending on the condition. Differs from an `if/else` in that both arms are always executed and the final value is picked based on the condition afterwards. Performs better than an `if/else` only if the condition is random \(means: branch prediction is not going to perform well\) and both alternatives are cheap. It is also worth to note that Binaryen will do relevant optimizations like switching to a `select` automatically, so using a ternary `? :` for example is just fine.

* ```ts
  function unreachable(): auto
  ```
  Emits an unreachable instruction that results in a runtime error \(trap\) when executed. Both a statement and an expression of any type. Beware that trapping in managed code will most likely lead to memory leaks or even break the program because it ends execution prematurely.

### Atomics 🦄

The following instructions represent the [WebAssembly threads and atomics](https://github.com/WebAssembly/threads) specification. Must be enabled with `--enable threads`.

* ```ts
  function atomic.load<T>(ptr: usize, immOffset?: usize): T
  ```
  Atomically loads an integer value from memory and returns it.

* ```ts
  function atomic.store<T>(ptr: usize, value: auto, immOffset?: usize): void
  ```
  Atomically stores an integer value to memory.

* ```ts
  function atomic.add<T>(ptr: usize, value: T, immOffset?: usize): T
  ```
  Atomically adds an integer value in memory.

* ```ts
  function atomic.sub<T>(ptr: usize, value: T, immOffset?: usize): T
  ```
  Atomically subtracts an integer value in memory.

* ```ts
  function atomic.and<T>(ptr: usize, value: T, immOffset?: usize): T
  ```
  Atomically performs a bitwise AND operation on an integer value in memory.

* ```ts
  function atomic.or<T>(ptr: usize, value: T, immOffset?: usize): T
  ```
  Atomically performs a bitwise OR operation on an integer value in memory.

* ```ts
  function atomic.xor<T>(ptr: usize, value: T, immOffset?: usize): T
  ```
  Atomically performs a bitwise XOR operation on an integer value in memory.

* ```ts
  function atomic.xchg<T>(ptr: usize, value: T, immOffset?: usize): T
  ```
  Atomically exchanges an integer value in memory.

* ```ts
  function atomic.cmpxchg<T>(ptr: usize, expected: T, replacement: T, immOffset?: usize): T
  ```
  Atomically compares and exchanges an integer value in memory if the condition is met.

* ```ts
  function atomic.wait<T>(ptr: usize, expected: T, timeout: i64): AtomicWaitResult
  ```

  Performs a wait operation on an address in memory suspending this agent if the integer condition is met. Return values are

  | Value | Description
  | :---- | :----------
  | 0     | OK - Woken by another agent.
  | 1     | NOT\_EQUAL - Loaded value did not match the expected value.
  | 2     | TIMED\_OUT - Not woken before the timeout expired.

* ```ts
  function atomic.notify(ptr: usize, count: i32): i32
  ```
  Performs a notify operation on an address in memory waking up suspended agents.

* ```ts
  function atomic.fence(): void
  ```
  Performs a fence operation, preserving synchronization guarantees of higher level languages.

Again, the `immOffset` argument must be a compile time constant value.

### SIMD 🦄

Likewise, these represent the [WebAssembly SIMD](https://github.com/WebAssembly/simd) specification. Must be enabled with `--enable simd`.

* ```ts
  function v128(a: i8, ... , p: i8): v128
  ```
  Initializes a 128-bit vector from sixteen 8-bit integer values. Arguments must be compile-time constants.

  See [Constructing constant vectors](#constructing-constant-vectors) for additional type-specific options.

* ```ts
  function v128.splat<T>(x: T): v128
  ```
  <details><summary>Creates a vector with identical lanes.</summary>

  | T        | Instruction
  |----------|-------------
  | i8, u8   | i8x16.splat
  | i16, u16 | i16x8.splat
  | i32, u32 | i32x4.splat
  | i64, u64 | i64x2.splat
  | f32      | f32x4.splat
  | f64      | f64x2.splat
  </details>

* ```ts
  function v128.extract_lane<T>(x: v128, idx: u8): T
  ```
  <details><summary>Extracts one lane as a scalar.</summary>

  | T        | Instruction
  |----------|-------------
  | i8       | i8x16.extract_lane_s
  | u8       | i8x16.extract_lane_u
  | i16      | i16x8.extract_lane_s
  | u16      | i16x8.extract_lane_u
  | i32, u32 | i32x4.extract_lane
  | i64, u64 | i64x2.extract_lane
  | f32      | f32x4.extract_lane
  | f64      | f64x2.extract_lane
  </details>

* ```ts
  function v128.replace_lane<T>(x: v128, idx: u8, value: T): v128
  ```
  <details><summary>Replaces one lane.</summary>

  | T        | Instruction
  |----------|-------------
  | i8, u8   | i8x16.replace_lane
  | i16, u16 | i16x8.replace_lane
  | i32, u32 | i32x4.replace_lane
  | i64, u64 | i64x2.replace_lane
  | f32      | f32x4.replace_lane
  | f64      | f64x2.replace_lane
  </details>

* ```ts
  function v128.shuffle<T>(a: v128, b: v128, ...lanes: u8[]): v128
  ```
  <details><summary>Selects lanes from either vector according to the specified lane indexes.</summary>

  | T                                              | Instruction
  |------------------------------------------------|-------------
  | i8, u8, i16, u16, i32, u32, i64, u64, f32, f64 | i8x16.shuffle
  </details>

* ```ts
  function v128.swizzle(a: v128, s: v128): v128
  ```
  Selects 8-bit lanes from the first vector according to the indexes \[0-15\] specified by the 8-bit lanes of the second vector.

* ```ts
  function v128.load(ptr: usize, immOffset?: usize, immAlign?: usize): v128
  ```
  Loads a vector from memory.

* ```ts
  function v128.load_ext<TFrom>(ptr: usize, immOffset?: usize, immAlign?: usize): v128
  ```
  <details><summary>Creates a vector by loading the lanes of the specified integer type and extending each to the next larger type.</summary>

  | TFrom | Instruction
  |-------|-------------
  | i8    | v128.load8x8_s
  | u8    | v128.load8x8_u
  | i16   | v128.load16x4_s
  | u16   | v128.load16x4_u
  | i32   | v128.load32x2_s
  | u32   | v128.load32x2_u
  </details>

* ```ts
  function v128.load_zero<TFrom>(ptr: usize, immOffset?: usize, immAlign?: usize): v128
  ```
  <details><summary>Creates a vector by loading a value of the specified type into the lowest bits and initializing all other bits of the vector to zero.</summary>

  | TFrom         | Instruction
  |---------------|-------------
  | i32, u32, f32 | v128.load32_zero
  | i64, u64, f64 | v128.load64_zero
  </details>

* ```ts
  function v128.load_lane<T>(
    ptr: usize, vec: v128, idx: u8, immOffset?: usize, immAlign?: usize
  ): v128
  ```
  <details><summary>Loads a single lane from memory into the specified lane of the given vector. Other lanes are bypassed as is.</summary>

  | T             | Instruction
  |---------------|-------------
  | i8, u8        | v128.load8_lane
  | i16, u16      | v128.load16_lane
  | i32, u32, f32 | v128.load32_lane
  | i64, u64, f64 | v128.load64_lane
  </details>

* ```ts
  function v128.store_lane<T>(
    ptr: usize, vec: v128, idx: u8, immOffset?: usize, immAlign?: usize
  ): v128
  ```
  <details><summary>Stores the single lane at the specified index of the given vector to memory.</summary>

  | T             | Instruction
  |---------------|-------------
  | i8, u8        | v128.store8_lane
  | i16, u16      | v128.store16_lane
  | i32, u32, f32 | v128.store32_lane
  | i64, u64, f64 | v128.store64_lane
  </details>

* ```ts
  function v128.load_splat<T>(ptr: usize, immOffset?: usize, immAlign?: usize): v128
  ```
  <details><summary>Creates a vector with identical lanes by loading the splatted value.</summary>

  | T             | Instruction
  |---------------|-------------
  | i8, u8        | v128.load8_splat
  | i16, u16      | v128.load16_splat
  | i32, u32, f32 | v128.load32_splat
  | i64, u64, f64 | v128.load64_splat
  </details>

* ```ts
  function v128.store(ptr: usize, value: v128, immOffset?: usize, immAlign?: usize): void
  ```
  Stores a vector to memory.

* ```ts
  function v128.add<T>(a: v128, b: v128): v128
  ```
  <details><summary>Adds each lane.</summary>

  | T        | Instruction
  |----------|-------------
  | i8, u8   | i8x16.add
  | i16, u16 | i16x8.add
  | i32, u32 | i32x4.add
  | i64, u64 | i64x2.add
  | f32      | f32x4.add
  | f64      | f64x2.add
  </details>

* ```ts
  function v128.sub<T>(a: v128, b: v128): v128
  ```
  <details><summary>Subtracts each lane.</summary>

  | T        | Instruction
  |----------|-------------
  | i8, u8   | i8x16.sub
  | i16, u16 | i16x8.sub
  | i32, u32 | i32x4.sub
  | i64, u64 | i64x2.sub
  | f32      | f32x4.sub
  | f64      | f64x2.sub
  </details>

* ```ts
  function v128.mul<T>(a: v128, b: v128): v128
  ```
  <details><summary>Multiplies each lane.</summary>

  | T        | Instruction
  |----------|-------------
  | i16, u16 | i16x8.mul
  | i32, u32 | i32x4.mul
  | i64, u64 | i64x2.mul
  | f32      | f32x4.mul
  | f64      | f64x2.mul
  </details>

* ```ts
  function v128.div<T>(a: v128, b: v128): v128
  ```
  <details><summary>Divides each floating point lane.</summary>

  | T   | Instruction
  |-----|-------------
  | f32 | f32x4.div
  | f64 | f64x2.div
  </details>

* ```ts
  function v128.neg<T>(a: v128): v128
  ```
  <details><summary>Negates each lane.</summary>

  | T        | Instruction
  |----------|-------------
  | i8, u8   | i8x16.neg
  | i16, u16 | i16x8.neg
  | i32, u32 | i32x4.neg
  | i64, u64 | i64x2.neg
  | f32      | f32x4.neg
  | f64      | f64x2.neg
  </details>

* ```ts
  function v128.add_sat<T>(a: v128, b: v128): v128
  ```
  <details><summary>Adds each signed small integer lane using saturation.</summary>

  | T   | Instruction
  |-----|-------------
  | i8  | i8x16.add_sat_s
  | u8  | i8x16.add_sat_u
  | i16 | i16x8.add_sat_s
  | u16 | i16x8.add_sat_u
  </details>

* ```ts
  function v128.sub_sat<T>(a: v128, b: v128): v128
  ```
  <details><summary>Subtracts each signed small integer lane using saturation.</summary>

  | T   | Instruction
  |-----|-------------
  | i8  | i8x16.sub_sat_s
  | u8  | i8x16.sub_sat_u
  | i16 | i16x8.sub_sat_s
  | u16 | i16x8.sub_sat_u
  </details>

* ```ts
  function v128.shl<T>(a: v128, b: i32): v128
  ```
  <details><summary>Performs a bitwise left shift by a scalar on each integer lane.</summary>

  | T        | Instruction
  |----------|-------------
  | i8, u8   | i8x16.shl
  | i16, u16 | i16x8.shl
  | i32, u32 | i32x4.shl
  | i64, u64 | i64x2.shl
  </details>

* ```ts
  function v128.shr<T>(a: v128, b: i32): v128
  ```
  <details><summary>Performs a bitwise right shift by a scalar on each integer lane.</summary>

  | T   | Instruction
  |-----|-------------
  | i8  | i8x16.shr_s
  | u8  | i8x16.shr_u
  | i16 | i16x8.shr_s
  | u16 | i16x8.shr_u
  | i32 | i32x4.shr_s
  | u32 | i32x4.shr_u
  | i64 | i64x2.shr_s
  | u64 | i64x2.shr_u
  </details>

* ```ts
  function v128.and(a: v128, b: v128): v128
  ```
  Performs the bitwise `a & b` operation on each lane.

* ```ts
  function v128.or(a: v128, b: v128): v128
  ```
  Performs the bitwise `a | b` operation on each lane.

* ```ts
  function v128.xor(a: v128, b: v128): v128
  ```
  Performs the bitwise `a ^ b` operation on each lane.

* ```ts
  function v128.andnot(a: v128, b: v128): v128
  ```
  Performs the bitwise `!a & b` operation on each lane.

* ```ts
  function v128.not(a: v128): v128
  ```
  Performs the bitwise `!a` operation on each lane.

* ```ts
  function v128.bitselect(a: v128, b: v128, mask: v128): v128
  ```
  Selects bits of either vector according to the specified mask.

* ```ts
  function v128.any_true(a: v128): bool
  ```
  Reduces a vector to a scalar indicating whether any lane is considered `true`.

* ```ts
  function v128.all_true<T>(a: v128): bool
  ```
  <details><summary>Reduces a vector to a scalar indicating whether all lanes are considered <code>true</code>.</summary>

  | T        | Instruction
  |----------|-------------
  | i8, u8   | i8x16.all_true
  | i16, u16 | i16x8.all_true
  | i32, u32 | i32x4.all_true
  | i64, u64 | i64x2.all_true
  </details>

* ```ts
  function v128.bitmask<T>(a: v128): bool
  ```
  <details><summary>Extracts the high bit of each integer lane (except 64-bit) and produces a scalar mask with all bits concatenated.</summary>

  | T        | Instruction
  |----------|-------------
  | i8, u8   | i8x16.bitmask
  | i16, u16 | i16x8.bitmask
  | i32, u32 | i32x4.bitmask
  | i64, u64 | i64x2.bitmask
  </details>

* ```ts
  function v128.popcnt<T>(a: v128): v128
  ```
  <details><summary>Counts the number of bits set to one within each lane.</summary>

  | T      | Instruction
  |--------|-------------
  | i8, u8 | i8x16.popcnt
  </details>

* ```ts
  function v128.min<T>(a: v128, b: v128): v128
  ```
  <details><summary>Computes the minimum of each lane.</summary>

  | T   | Instruction
  |-----|-------------
  | i8  | i8x16.min_s
  | u8  | i8x16.min_u
  | i16 | i16x8.min_s
  | u16 | i16x8.min_u
  | i32 | i32x4.min_s
  | u32 | i32x4.min_u
  | f32 | f32x4.min
  | f64 | f64x2.min
  </details>

* ```ts
  function v128.max<T>(a: v128, b: v128): v128
  ```
  <details><summary>Computes the maximum of each lane.</summary>

  | T   | Instruction
  |-----|-------------
  | i8  | i8x16.max_s
  | u8  | i8x16.max_u
  | i16 | i16x8.max_s
  | u16 | i16x8.max_u
  | i32 | i32x4.max_s
  | u32 | i32x4.max_u
  | f32 | f32x4.max
  | f64 | f64x2.max
  </details>

* ```ts
  function v128.pmin<T>(a: v128, b: v128): v128
  ```
  <details><summary>Computes the psuedo-minimum of each lane.</summary>

  | T   | Instruction
  |-----|-------------
  | f32 | f32x4.pmin
  | f64 | f64x2.pmin
  </details>

* ```ts
  function v128.pmax<T>(a: v128, b: v128): v128
  ```
  <details><summary>Computes the pseudo-maximum of each lane.</summary>

  | T   | Instruction
  |-----|-------------
  | f32 | f32x4.pmax
  | f64 | f64x2.pmax
  </details>

* ```ts
  function v128.dot<T>(a: v128, b: v128): v128
  ```
  <details><summary>Computes the dot product of two 16-bit integer lanes each, yielding lanes one size wider than the input.</summary>

  | T   | Instruction
  |-----|-------------
  | i16 | i32x4.dot_i16x8_s
  </details>

* ```ts
  function v128.avgr<T>(a: v128, b: v128): v128)
  ```
  <details><summary>Computes the rounding average of each unsigned small integer lane.</summary>

  | T   | Instruction
  |-----|-------------
  | u8  | i8x16.avgr_u
  | u16 | i16x8.avgr_u
  </details>

* ```ts
  function v128.abs<T>(a: v128): v128
  ```
  <details><summary>Computes the absolute value of each lane (except 64-bit integers).</summary>

  | T        | Instruction
  |----------|-------------
  | i8, u8   | i8x16.abs
  | i16, u16 | i16x8.abs
  | i32, u32 | i32x4.abs
  | i64, u64 | i64x2.abs
  | f32      | f32x4.abs
  | f64      | f64x2.abs
  </details>

* ```ts
  function v128.sqrt<T>(a: v128): v128
  ```
  <details><summary>Computes the square root of each floating point lane.</summary>

  | T   | Instruction
  |-----|-------------
  | f32 | f32x4.sqrt
  | f64 | f64x2.sqrt
  </details>

* ```ts
  function v128.ceil<T>(a: v128): v128
  ```
  <details><summary>Performs the ceiling operation on each lane.</summary>

  | T   | Instruction
  |-----|-------------
  | f32 | f32x4.ceil
  | f64 | f64x2.ceil
  </details>

* ```ts
  function v128.floor<T>(a: v128): v128
  ```
  <details><summary>Performs the floor operation on each lane.</summary>

  | T   | Instruction
  |-----|-------------
  | f32 | f32x4.floor
  | f64 | f64x2.floor
  </details>

* ```ts
  function v128.trunc<T>(a: v128): v128
  ```
  <details><summary>Rounds to the nearest integer towards zero of each lane.</summary>

  | T   | Instruction
  |-----|-------------
  | f32 | f32x4.trunc
  | f64 | f64x2.trunc
  </details>

* ```ts
  function v128.nearest<T>(a: v128): v128
  ```
  <details><summary>Rounds to the nearest integer tied to even of each lane.</summary>

  | T   | Instruction
  |-----|-------------
  | f32 | f32x4.nearest
  | f64 | f64x2.nearest
  </details>

* ```ts
  function v128.eq<T>(a: v128, b: v128): v128
  ```
  <details><summary>Computes which lanes are equal.</summary>

  | T        | Instruction
  |----------|-------------
  | i8, u8   | i8x16.eq
  | i16, u16 | i16x8.eq
  | i32, u32 | i32x4.eq
  | i64, u64 | i64x2.eq
  | f32      | f32x4.eq
  | f64      | f64x2.eq
  </details>

* ```ts
  function v128.ne<T>(a: v128, b: v128): v128
  ```
  <details><summary>Computes which lanes are not equal.</summary>

  | T        | Instruction
  |----------|-------------
  | i8, u8   | i8x16.ne
  | i16, u16 | i16x8.ne
  | i32, u32 | i32x4.ne
  | i64, u64 | i64x2.ne
  | f32      | f32x4.ne
  | f64      | f64x2.ne
  </details>

* ```ts
  function v128.lt<T>(a: v128, b: v128): v128
  ```
  <details><summary>Computes which lanes of the first vector are less than those of the second.</summary>

  | T   | Instruction
  |-----|-------------
  | i8  | i8x16.lt_s
  | u8  | i8x16.lt_u
  | i16 | i16x8.lt_s
  | u16 | i16x8.lt_u
  | i32 | i32x4.lt_s
  | u32 | i32x4.lt_u
  | i64 | i64x2.lt_s
  | f32 | f32x4.lt
  | f64 | f64x2.lt
  </details>

* ```ts
  function v128.le<T>(a: v128, b: v128): v128
  ```
  <details><summary>Computes which lanes of the first vector are less than or equal those of the second.</summary>

  | T   | Instruction
  |-----|-------------
  | i8  | i8x16.le_s
  | u8  | i8x16.le_u
  | i16 | i16x8.le_s
  | u16 | i16x8.le_u
  | i32 | i32x4.le_s
  | u32 | i32x4.le_u
  | i64 | i64x2.le_s
  | f32 | f32x4.le
  | f64 | f64x2.le
  </details>

* ```ts
  function v128.gt<T>(a: v128, b: v128): v128
  ```
  <details><summary>Computes which lanes of the first vector are greater than those of the second.</summary>

  | T   | Instruction
  |-----|-------------
  | i8  | i8x16.gt_s
  | u8  | i8x16.gt_u
  | i16 | i16x8.gt_s
  | u16 | i16x8.gt_u
  | i32 | i32x4.gt_s
  | u32 | i32x4.gt_u
  | i64 | i64x2.gt_s
  | f32 | f32x4.gt
  | f64 | f64x2.gt
  </details>

* ```ts
  function v128.ge<T>(a: v128, b: v128): v128
  ```
  <details><summary>Computes which lanes of the first vector are greater than or equal those of the second.</summary>

  | T   | Instruction
  |-----|-------------
  | i8  | i8x16.ge_s
  | u8  | i8x16.ge_u
  | i16 | i16x8.ge_s
  | u16 | i16x8.ge_u
  | i32 | i32x4.ge_s
  | u32 | i32x4.ge_u
  | i64 | i64x2.ge_s
  | f32 | f32x4.ge
  | f64 | f64x2.ge
  </details>

* ```ts
  function v128.convert<TFrom>(a: v128): v128
  ```
  <details><summary>Converts each lane of a vector from integer to single-precision floating point.</summary>

  | TFrom | Instruction
  |-------|-------------
  | i32   | f32x4.convert_i32x4_s
  | u32   | f32x4.convert_i32x4_u
  </details>

* ```ts
  function v128.convert_low<TFrom>(a: v128): v128
  ```
  <details><summary>Converts the low lanes of a vector from integer to double-precision floating point.</summary>

  | TFrom | Instruction
  |-------|-------------
  | i32   | f64x2.convert_low_i32x4_s
  | u32   | f64x2.convert_low_i32x4_u
  </details>

* ```ts
  function v128.trunc_sat<TTo>(a: v128): v128
  ```
  <details><summary>Truncates each lane of a vector from single-precision floating point to integer with saturation. Takes the target type.</summary>

  | TTo | Instruction
  |-----|-------------
  | i32 | i32x4.trunc_sat_f32x4_s
  | u32 | i32x4.trunc_sat_f32x4_u
  </details>

* ```ts
  function v128.trunc_sat_zero<TTo>(a: v128): v128
  ```
  <details><summary>Truncates each lane of a vector from double-precision floating point to integer with saturation. Takes the target type.</summary>

  | TTo | Instruction
  |-----|-------------
  | i32 | i32x4.trunc_sat_f64x2_s_zero
  | u32 | i32x4.trunc_sat_f64x2_u_zero
  </details>

* ```ts
  function v128.narrow<TFrom>(a: v128, b: v128): v128
  ```
  <details><summary>Narrows wider integer lanes to their respective narrower lanes.</summary>

  | TFrom | Instruction
  |-------|-------------
  | i16   | i8x16.narrow_i16x8_s
  | u16   | i8x16.narrow_i16x8_u
  | i32   | i16x8.narrow_i32x4_s
  | u32   | i16x8.narrow_i32x4_u
  </details>

* ```ts
  function v128.extend_low<TFrom>(a: v128): v128
  ```
  <details><summary>Extends the low half of narrower integer lanes to their respective wider lanes.</summary>

  | TFrom | Instruction
  |-------|-------------
  | i8    | i16x8.extend_low_i8x16_s
  | u8    | i16x8.extend_low_i8x16_u
  | i16   | i32x4.extend_low_i16x8_s
  | u16   | i32x4.extend_low_i16x8_u
  | i32   | i64x2.extend_low_i32x4_s
  | u32   | i64x2.extend_low_i32x4_u
  </details>

* ```ts
  function v128.extend_high<TFrom>(a: v128): v128
  ```
  <details><summary>Extends the high half of narrower integer lanes to their respective wider lanes.</summary>

  | TFrom | Instruction
  |-------|-------------
  | i8    | i16x8.extend_high_i8x16_s
  | u8    | i16x8.extend_high_i8x16_u
  | i16   | i32x4.extend_high_i16x8_s
  | u16   | i32x4.extend_high_i16x8_u
  | i32   | i64x2.extend_high_i32x4_s
  | u32   | i64x2.extend_high_i32x4_u
  </details>

* ```ts
  function v128.extadd_pairwise<TFrom>(a: v128): v128
  ```
  <details><summary>Adds lanes pairwise producing twice wider extended results.</summary>

  | TFrom | Instruction
  |-------|-------------
  | i16   | i16x8.extadd_pairwise_i8x16_s
  | u16   | i16x8.extadd_pairwise_i8x16_u
  | i32   | i32x4.extadd_pairwise_i16x8_s
  | u32   | i32x4.extadd_pairwise_i16x8_u
  </details>

* ```ts
  function v128.demote_zero<T>(a: v128): v128
  ```
  <details><summary>Demotes each float lane to lower precision. The higher lanes of the result are initialized to zero.</summary>

  | T   | Instruction
  |-----|-------------
  | f64 | f32x4.demote_f64x2_zero
  </details>

* ```ts
  function v128.promote_low<T>(a: v128): v128
  ```
  <details><summary>Promotes the lower float lanes to higher precision.</summary>

  | T   | Instruction
  |-----|-------------
  | f32 | f64x2.promote_low_f32x4
  </details>

* ```ts
  function v128.q15mulr_sat<T>(a: v128, b: v128): v128
  ```
  <details><summary>Performs the line-wise saturating rounding multiplication in Q15 format.</summary>

  | T   | Instruction
  |-----|-------------
  | i16 | i16x8.q15mulr_sat_s
  </details>

* ```ts
  function v128.extmul_low<T>(a: v128, b: v128): v128
  ```
  <details><summary>Performs the lane-wise integer extended multiplication of the lower lanes producing a twice wider result than the inputs.</summary>

  | T   | Instruction
  |-----|-------------
  | i8  | i16x8.extmul_low_i8x16_s
  | u8  | i16x8.extmul_low_i8x16_u
  | i16 | i32x4.extmul_low_i16x8_s
  | u16 | i32x4.extmul_low_i16x8_u
  | i32 | i64x2.extmul_low_i32x4_s
  | u32 | i64x2.extmul_low_i32x4_u
  </details>

* ```ts
  function v128.extmul_high<T>(a: v128, b: v128): v128
  ```
  <details><summary>Performs the lane-wise integer extended multiplication of the higher lanes producing a twice wider result than the inputs.</summary>

  | T   | Instruction
  |-----|-------------
  | i8  | i16x8.extmul_high_i8x16_s
  | u8  | i16x8.extmul_high_i8x16_u
  | i16 | i32x4.extmul_high_i16x8_s
  | u16 | i32x4.extmul_high_i16x8_u
  | i32 | i64x2.extmul_high_i32x4_s
  | u32 | i64x2.extmul_high_i32x4_u
  </details>

#### Constructing constant vectors

* ```ts
  function i8x16(a: i8, ... , p: i8): v128
  ```
  Initializes a 128-bit vector from sixteen 8-bit integer values. Arguments must be compile-time constants.

* ```ts
  function i16x8(a: i16, ..., h: i16): v128
  ```
  Initializes a 128-bit vector from eight 16-bit integer values. Arguments must be compile-time constants.

* ```ts
  function i32x4(a: i32, b: i32, c: i32, d: i32): v128
  ```
  Initializes a 128-bit vector from four 32-bit integer values. Arguments must be compile-time constants.

* ```ts
  function i64x2(a: i64, b: i64): v128
  ```
  Initializes a 128-bit vector from two 64-bit integer values. Arguments must be compile-time constants.

* ```ts
  function f32x4(a: f32, b: f32, c: f32, d: f32): v128
  ```
  Initializes a 128-bit vector from four 32-bit float values. Arguments must be compile-time constants.

* ```ts
  function f64x2(a: f64, b: f64): v128
  ```
  Initializes a 128-bit vector from two 64-bit float values. Arguments must be compile-time constants.

### Inline instructions

In addition to using the generic builtins above, most WebAssembly instructions can be written directly in AssemblyScript code. For example, the following is equivalent:

```ts
// generic builtin
v128.splat<i32>(42);

// inline instruction
i32x4.splat(42);
```
