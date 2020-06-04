---
description: When one number just doesn't cut it.
---

# Types

Instead of using the `number` type for all sorts of numeric values, AssemblyScript inherits WebAssembly's more specific integer and floating point types:

| AssemblyScript Type | WebAssembly type | Description
| :------------------ | :--------------- | :-----------
| `i32`               | i32              | A 32-bit signed integer.
| `u32`               | i32              | A 32-bit unsigned integer.
| `i64`               | i64              | A 64-bit signed integer.
| `u64`               | i64              | A 64-bit unsigned integer.
| `f32`               | f32              | A 32-bit float.
| `f64`               | f64              | A 64-bit float.
| `v128`              | v128             | A 128-bit vector 🦄.
| `anyref`            | anyref           | An opaque host reference 🦄.
| **Small integer types**                |
| `i8`                | i32              | An 8-bit signed integer.
| `u8`                | i32              | An 8-bit unsigned integer.
| `i16`               | i32              | A 16-bit signed integer.
| `u16`               | i32              | A 16-bit unsigned integer.
| `bool`              | i32              | A 1-bit unsigned integer.
| **Variable integer types**             |
| `isize`             | i32 or i64       | A 32-bit signed integer in WASM32.<br />A 64-bit signed integer in WASM64 🦄.
| `usize`             | i32 or i64       | A 32-bit unsigned integer in WASM32.<br />A 64-bit unsigned integer in WASM64 🦄.
| **Special types**                      |
| `void`              | -                | Indicates no return value.
| `auto`              | ?                | Makes an educated guess. Internal only.

## Type rules

AssemblyScript will complain when it sees an implicit conversion that might not actually be intended, quite similar to what a C compiler would do.

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

1. if the comparison is absolute \(`==`, `!=`\)
2. if the comparison is relative \(`>`, `<`, `>=`, `<=`\) and **both types have the same signedness**

because WebAssembly has distinct operations for signed and unsigned comparisons. The comparison uses the larger type and returns `bool`.

### Bit shifts

The result of a bit shift \(`<<`, `>>`\) is the left type, with the right type implicitly converted to the left type, performing an arithmetic shift if the left type is signed and a logical shift if the left type is unsigned.

The result of an unsigned right shift \(`>>>`\) is the left type \(signedness is retained\), with the right type implicitly converted to the left type, but always performing a logical shift.

If the left type is a float, an error is emitted.

## Macro types

The following macro types provide access to related types that would otherwise be impossible to obtain.

| Macro type    | Description
| :------------ | :----------
| `native<T>`   | Obtains the underlying native type of `T`, e.g. `u32` if `T` is a class \(in WASM32\).
| `indexof<T>`  | Obtains the index type of a collection based on the indexed access overload.
| `valueof<T>`  | Obtains the value type of a collection based on the indexed access overload.
| `returnof<T>` | Obtains the return type of a function type.
