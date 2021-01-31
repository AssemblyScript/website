---
description: Reinventing the wheel. Again. But with a notch.
---

# Environment

A WebAssembly environment is more limited than a usual browser environment, but AssemblyScript tries to fill the gaps by reimplementing commonly known functionality, besides providing direct access to WebAssembly instructions through built-ins.

## Standard library

AssemblyScript comes with its own [standard library](./stdlib/globals.md) very much resembling what developers became used to when writing JavaScript, with a few specialized classes, like `StaticArray`, that exist in AssemblyScript only to tackle very specific problems.

Additional rather low-level WebAssembly functionality that the standard library makes extensive use of is described below.

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

## Sizes and alignments

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

## Utility

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

## Low-level WebAssembly operations

### Math

The following generic built-ins compile to WebAssembly instructions directly.

* ```ts
  function clz<T>(value: T): T
  ```
  Performs the sign-agnostic count leading zero bits operation on a 32-bit or 64-bit integer. All zero bits are considered leading if the value is zero.

* ```ts
  function ctz<T>(value: T): T
  ```
  Performs the sign-agnostic count tailing zero bits operation on a 32-bit or 64-bit integer. All zero bits are considered trailing if the value is zero.

* ```ts
  function popcnt<T>(value: T): T
  ```
  Performs the sign-agnostic count number of one bits operation on a 32-bit or 64-bit integer.

* ```ts
  function rotl<T>(value: T, shift: T): T
  ```
  Performs the sign-agnostic rotate left operation on a 32-bit or 64-bit integer.

* ```ts
  function rotr<T>(value: T, shift: T): T
  ```
  Performs the sign-agnostic rotate right operation on a 32-bit or 64-bit integer.

* ```ts
  function abs<T>(value: T): T
  ```
  Computes the absolute value of an integer or float.

* ```ts
  function max<T>(left: T, right: T): T
  ```
  Determines the maximum of two integers or floats. If either operand is `NaN`, returns `NaN`.

* ```ts
  function min<T>(left: T, right: T): T
  ```
  Determines the minimum of two integers or floats. If either operand is `NaN`, returns `NaN`.

* ```ts
  function ceil<T>(value: T): T
  ```
  Performs the ceiling operation on a 32-bit or 64-bit float.

* ```ts
  function floor<T>(value: T): T
  ```
  Performs the floor operation on a 32-bit or 64-bit float.

* ```ts
  function copysign<T>(x: T , y: T): T
  ```
  Composes a 32-bit or 64-bit float from the magnitude of `x` and the sign of `y`.

* ```ts
  function nearest<T>(value: T): T
  ```
  Rounds to the nearest integer tied to even of a 32-bit or 64-bit float.

* ```ts
  function reinterpret<T>(value: auto): T
  ```
  Reinterprets the bits of the specified value as type `T`. Valid reinterpretations are u32/i32 to/from f32 and u64/i64 to/from f64.

* ```ts
  function sqrt<T>(value: T): T
  ```
  Calculates the square root of a 32-bit or 64-bit float.

* ```ts
  function trunc<T>(value: T): T
  ```
  Rounds to the nearest integer towards zero of a 32-bit or 64-bit float.

### Memory

Similarly, the following built-ins emit WebAssembly instructions accessing or otherwise modifying memory.

* ```ts
  function load<T>(ptr: usize, immOffset?: usize): T
  ```
  Loads a value of the specified type from memory. Equivalent to dereferencing a pointer in other languages.

* ```ts
  function store<T>(ptr: usize, value: auto, immOffset?: usize): void
  ```
  Stores a value of the specified type to memory. Equivalent to dereferencing a pointer in other languages when assigning a value.

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

#### **Memory Manager**

An unsafe interface to use the dynamic memory manager directly, resembling `malloc`, `realloc` and `free` in C. Manual memory management can be used in parallel to garbage collection, which can be quite handy, but that manually managed blocks cannot be mixed with garbage collected objects (i.e. trying to `heap.free` a GC object or casting a block to a managed object respectively would break since one has a GC header and the other does not).

* ```ts
  function heap.alloc(size: usize): usize
  ```
  Allocates a chunk of memory of at least the specified size.

* ```ts
  function heap.realloc(ptr: usize, size: usize): usize
  ```
  Reallocates a chunk of memory to have at least the specified size.

* ```ts
  function heap.free(ptr: usize): void
  ```
  Frees a chunk of memory.

* ```ts
  function heap.reset(): void
  ```
  Dangerously resets the entire heap. Specific to the "stub" runtime.

#### **Memory Utility**

Sign-agnostic endian conversions \(reverse bytes\).

* ```ts
  function bswap<T>(value: T): T
  ```
  Reverses the byte order of the specified integer.

* ```ts
  function bswap16<T>(value: T): T
  ```
  Reverses only the last 2 bytes regardless of the type argument.

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

* ```ts
  function v128.splat<T>(x: T): v128
  ```
  Creates a vector with identical lanes.

* ```ts
  function v128.extract_lane<T>(x: v128, idx: u8): T
  ```
  Extracts one lane as a scalar.

* ```ts
  function v128.replace_lane<T>(x: v128, idx: u8, value: T): v128
  ```
  Replaces one lane.

* ```ts
  function v128.shuffle<T>(a: v128, b: v128, ...lanes: u8[]): v128
  ```
  Selects lanes from either vector according to the specified lane indexes.

* ```ts
  function v128.swizzle(a: v128, s: v128): v128
  ```
  Selects 8-bit lanes from the first vector according to the indexes \[0-15\] specified by the 8-bit lanes of the second vector.

* ```ts
  function v128.load(ptr: usize, immOffset?: usize, immAlign?: usize): v128
  ```
  Loads a vector from memory.

* ```ts
  function v128.load_splat<T>(ptr: usize, immOffset?: usize, immAlign?: usize): v128
  ```
  Creates a vector with identical lanes by loading the splatted value.

* ```ts
  function v128.load_ext<TFrom>(ptr: usize, immOffset?: usize, immAlign?: usize): v128
  ```
  Creates a vector by loading the lanes of the specified integer type and extending each to the next larger type.

* ```ts
  function v128.store(ptr: usize, value: v128, immOffset?: usize, immAlign?: usize): void
  ```
  Stores a vector to memory.

* ```ts
  function v128.add<T>(a: v128, b: v128): v128
  ```
  Adds each lane.

* ```ts
  function v128.sub<T>(a: v128, b: v128): v128
  ```
  Subtracts each lane.

* ```ts
  function v128.mul<T>(a: v128, b: v128): v128
  ```
  Multiplies each lane.

* ```ts
  function v128.div<T>(a: v128, b: v128): v128
  ```
  Divides each floating point lane.

* ```ts
  function v128.neg<T>(a: v128): v128
  ```
  Negates each lane.

* ```ts
  function v128.add_saturate<T>(a: v128, b: v128): v128
  ```
  Adds each signed small integer lane using saturation.

* ```ts
  function v128.sub_saturate<T>(a: v128, b: v128): v128
  ```
  Subtracts each signed small integer lane using saturation.

* ```ts
  function v128.shl<T>(a: v128, b: i32): v128
  ```
  Performs a bitwise left shift by a scalar on each integer lane.

* ```ts
  function v128.shr<T>(a: v128, b: i32): v128
  ```
  Performs a bitwise right shift by a scalar on each integer lane.

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
  function v128.any_true<T>(a: v128): bool
  ```
  Reduces a vector to a scalar indicating whether any lane is considered `true`.

* ```ts
  function v128.all_true<T>(a: v128): bool
  ```
  Reduces a vector to a scalar indicating whether all lanes are considered `true`.

* ```ts
  function v128.bitmask<T>(a: v128): bool
  ```
  Extracts the high bit of each integer lane (except 64-bit) and produces a scalar mask with all bits concatenated.

* ```ts
  function v128.max<T>(a: v128, b: v128): v128
  ```
  Computes the maximum of each lane.

* ```ts
  function v128.min<T>(a: v128, b: v128): v128
  ```
  Computes the minimum of each lane.

* ```ts
  function v128.dot<T>(a: v128, b: v128): v128
  ```
  Computes the dot product of two 16-bit integer lanes each, yielding lanes one size wider than the input.

* ```ts
  function v128.avgr<T>(a: v128, b: v128): v128)
  ```
  Computes the rounding average of each unsigned small integer lane.

* ```ts
  function v128.abs<T>(a: v128): v128
  ```
  Computes the absolute value of each lane (except 64-bit integers).

* ```ts
  function v128.sqrt<T>(a: v128): v128
  ```
  Computes the square root of each floating point lane.

* ```ts
  function v128.ceil<T>(a: v128): v128
  ```
  Performs the ceiling operation on each lane.

* ```ts
  function v128.floor<T>(a: v128): v128
  ```
  Performs the floor operation on each lane.

* ```ts
  function v128.trunc<T>(a: v128): v128
  ```
  Rounds to the nearest integer towards zero of each lane.

* ```ts
  function v128.nearest<T>(a: v128): v128
  ```
  Rounds to the nearest integer tied to even of each lane.

* ```ts
  function v128.eq<T>(a: v128, b: v128): v128
  ```
  Computes which lanes are equal.

* ```ts
  function v128.ne<T>(a: v128, b: v128): v128
  ```
  Computes which lanes are not equal.

* ```ts
  function v128.lt<T>(a: v128, b: v128): v128
  ```
  Computes which lanes of the first vector are less than those of the second.

* ```ts
  function v128.le<T>(a: v128, b: v128): v128
  ```
  Computes which lanes of the first vector are less than or equal those of the second.

* ```ts
  function v128.gt<T>(a: v128, b: v128): v128
  ```
  Computes which lanes of the first vector are greater than those of the second.

* ```ts
  function v128.ge<T>(a: v128, b: v128): v128
  ```
  Computes which lanes of the first vector are greater than or equal those of the second.

* ```ts
  function v128.convert<TFrom>(a: v128): v128
  ```
  Converts each lane from integer to floating point.

* ```ts
  function v128.trunc_sat<TTo>(a: v128): v128
  ```
  Truncates each lane from floating point to integer with saturation.

* ```ts
  function v128.narrow<TFrom>(a: v128, b: v128): v128
  ```
  Narrows wider integer lanes to their respective narrower lanes.

* ```ts
  function v128.widen_low<TFrom>(a: v128): v128
  ```
  Widens the low half of narrower integer lanes to their respective wider lanes.

* ```ts
  function v128.widen_high<TFrom>(a: v128): v128
  ```
  Widens the high half of narrower integer lanes to their respective wider lanes.

* ```ts
  function v128.qfma<T>(a: v128, b: v128, c: v128): v128
  ```
  Computes `(a * b) + c` for each floating point lane.

* ```ts
  function v128.qfms<T>(a: v128, b: v128, c: v128): v128
  ```
  Computes `(a * b) - c` for each floating point lane.

In addition, the namespaces `i8x16`, `i16x8`, `i32x4`, `i64x2` , `f32x4` and `f64x2` provide their respective non-generic instructions, like `i32x4.splat` etc. Each of them can also be used to create a literal directly:

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

The namespaces `v8x16`, `v16x8`, `v32x4` and `v64x2` provide the respective sign agnostic instructions according to text format.
