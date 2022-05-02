---
description: When one number just doesn't cut it.
---

# Types

AssemblyScript inherits WebAssembly's more specific integer, floating point and reference types:

| AssemblyScript Type | WebAssembly type | TypeScript type  | Description
| :------------------ | :--------------- | :--------------- | :-----------
| *Integer types*     |                  |                  |
| `i32`               | i32              | number           | A 32-bit signed integer.
| `u32`               | i32              | number           | A 32-bit unsigned integer.
| `i64`               | i64              | bigint           | A 64-bit signed integer.
| `u64`               | i64              | bigint           | A 64-bit unsigned integer.
| `isize`             | i32 or i64       | number or bigint | A 32-bit signed integer in WASM32.<br />A 64-bit signed integer in WASM64 🦄.
| `usize`             | i32 or i64       | number or bigint | A 32-bit unsigned integer in WASM32.<br />A 64-bit unsigned integer in WASM64 🦄.
||
| *Floating point types*                 |
| `f32`               | f32              | number           | A 32-bit float.
| `f64`               | f64              | number           | A 64-bit float.
||
| *Small integer types*                  |
| `i8`                | i32              | number           | An 8-bit signed integer.
| `u8`                | i32              | number           | An 8-bit unsigned integer.
| `i16`               | i32              | number           | A 16-bit signed integer.
| `u16`               | i32              | number           | A 16-bit unsigned integer.
| `bool`              | i32              | boolean          | A 1-bit unsigned integer.
||
| *Vector types* 🦄                     |
| `v128`              | v128             | -                | A 128-bit vector.
||
| *Reference types* 🦄                  |
| `externref`         | externref        | Object           | An opaque host reference.
| `funcref  `         | funcref          | Function         | An opaque host reference.
||
| *Special types*                        |
| `void`              | -                | void             | Indicates no return value.

Just like in TypeScript, types are annotated after variable, function argument or class member names, separated by `:`, like so:

```ts
function add(a: i32, b: i32): i32 {
  let sum: i32 = a + b; // type can be inferred, annotation can be omitted
  return sum;
}
```

## Type rules

The compiler will complain when it sees an implicit conversion that might not actually be intended, quite similar to what a C compiler would do.

### Casting

In AssemblyScript, the type assertions `<T>expression` and `expression as T` known from TypeScript become explicit type conversions, essentially telling the compiler that the conversion is intended. In addition, each of the type names mentioned above, except aliases, also act as portable conversion built-ins that can be used just like `i32(expression)`. Using portable conversions is especially useful where the exact same code is meant to be compiled to JavaScript with the TypeScript compiler \([see](./portability.md)\), that otherwise would require the insertion of asm.js-style type coercions like `expression | 0`.

### Inference

Compared to TypeScript, type inference in AssemblyScript is limited because the type of each expression must be known in advance. This means that variable and parameter declarations must either have their type annotated or have an initializer. Without a type annotation and only an initializer, AssemblyScript will assume `i32` at first and only reconsider another type if the value doesn't fit \(becomes `i64`\), is a float \(becomes `f64`\) or irrefutably has another type than these, like the type of a variable, the return type of a function or a class type. Furthermore, functions must be annotated with a return type to help the compiler make the correct decisions, for example where a literal is returned or multiple return statements are present.

### Nullability

Basic types cannot be nullable, but class and function types can. Appending `| null` declares a nullable type.

### Assignability

Assigning a value of one type to a target of another type can be performed without explicit casts where the full range of possible values can be represented in the target type, regardless of interpretation/signedness:

| ↱       | bool | i8/u8 | i16/u16 | i32/u32 | i64/u64 | f32 | f64 |
| :------ | :--- | :---- | :------ | :------ | :------ | :-- | :-- |
| bool    | ✓ | ✓   | ✓ | ✓ | ✓ | ✓ | ✓ |
| i8/u8   |  | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| i16/u16 |  |  | ✓ | ✓ | ✓ | ✓ | ✓ |
| i32/u32 |  |  |  | ✓ | ✓ |  | ✓ |
| i64/u64 |  |  |  |  | ✓ |  |  |
| f32     |  |  |  |  |  | ✓ | ✓ |
| f64     |  |  |  |  |  |  | ✓ |

Note that `isize` and `usize` are aliases of either `i32` and `u32` in WASM32 respectively `i64` and `u64` in WASM64 🦄.

```ts
var  i8val: i8  = -128  // 0x80
var  u8val: u8  = i8val // becomes 128 (0x80)
var i16val: i16 = i8val // becomes -128 through sign-extension (0xFF80)
var u16val: u16 = i8val // becomes 65408 through masking (0xFF80)
var f32val: f32 = i8val // becomes -128.0
```

### Comparability

Comparing two values of different types can be performed without an explicit cast under the same rules as outlined in assignability above

1. if the comparison is absolute \(`==` or `===`, `!=` or `!==`\)
2. if the comparison is relative \(`>`, `<`, `>=`, `<=`\) and **both types have the same signedness**

because WebAssembly has distinct operations for signed and unsigned comparisons. The comparison uses the larger type and returns `bool`.

Note that `==` and `===` respectively `!=` and `!==` are the same in AssemblyScript because comparing two values of different types is invalid under its strict typing rules anyhow.

### Bit shifts

The result of a bit shift \(`<<`, `>>`\) is the left type, with the right type implicitly converted to the left type, performing an arithmetic shift if the left type is signed and a logical shift if the left type is unsigned.

The result of an unsigned right shift \(`>>>`\) is the left type \(signedness is retained\), with the right type implicitly converted to the left type, but always performing a logical shift.

Note that only the `log2(sizeof<T>())` least significant bits of the shift affect the result:

| Type      | Significant bits | Example
| :-------- | :--------------: | :------------------------
| i8 / u8   | 3                | `x << y` ≡ `x << (y & 7)`
| i16 / u16 | 4                | `x << y` ≡ `x << (y & 15)`
| i32 / u32 | 5                | `x << y` ≡ `x << (y & 31)`
| i64 / u64 | 6                | `x << y` ≡ `x << (y & 63)`

If the left type is a float, an error is emitted.

## Macro types

The following macro types provide access to related types that would otherwise be impossible to obtain.

| Macro type    | Description
| :------------ | :----------
| `native<T>`   | Obtains the underlying native type of `T`, e.g. `u32` if `T` is a class \(in WASM32\).
| `indexof<T>`  | Obtains the index type of a collection based on the indexed access overload.
| `valueof<T>`  | Obtains the value type of a collection based on the indexed access overload.
| `returnof<T>` | Obtains the return type of a function type.

## Range limits

Various range limits specific to the WebAssembly types are present as global constants for convenience:

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
  const f32.MIN_NORMAL_VALUE: f32 = 1.17549435e-38
  const f32.MIN_SAFE_INTEGER: f32 = -16777215
  const f32.MAX_SAFE_INTEGER: f32 = 16777215
  const f32.EPSILON: f32 = 1.19209290e-07
  ```

* ```ts
  const f64.MIN_VALUE: f64 = -1.7976931348623157e+308
  const f64.MAX_VALUE: f64 = 1.7976931348623157e+308
  const f64.MIN_NORMAL_VALUE: f64 = 2.2250738585072014e-308
  const f64.MIN_SAFE_INTEGER: f64 = -9007199254740991
  const f64.MAX_SAFE_INTEGER: f64 = 9007199254740991
  const f64.EPSILON: f64 = 2.2204460492503131e-16
  ```
