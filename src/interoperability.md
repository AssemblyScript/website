---
description: How to talk to AssemblyScript from C or other languages.
---

# Interoperability

How to talk to AssemblyScript from C or other languages.

## Strings

Strings in AssemblyScript are stored in [WTF-16](https://simonsapin.github.io/wtf-8/#ill-formed-utf-16) encoding, closely matching JavaScript and its string APIs. When embedding AssemblyScript into a C or Rust environment, conversion between WTF-16 and UTF-8 is typically necessary \([API](./stdlib/string.md#encoding-api)\).

Details to keep in mind: In UTF-16, certain Unicode **code points** are represented by two UTF-16 **code units** called surrogate pairs. However, just like in JavaScript, strings are not sanitized so lone surrogates can appear in a string, which are technically ill-formed UTF-16. This is done to mimic JavaScript as closely as possible, and avoids string re-encoding when calling JavaScript APIs from WebAssembly.

We hope that future WebAssembly features will be designed with both C/Rust and JS/WebAPIs in mind without penalizing the respective other. ([1](https://github.com/WebAssembly/interface-types/issues/13), [2](https://github.com/WebAssembly/gc/issues/145))

## Class layout

Layout of objects in memory resembles that of non-packed C structs, and `@unmanaged` classes \(not tracked by GC, essentially C structs\) can be used to describe them:

```c
struct Foo {
  uint32_t bar;
  uint16_t baz;
  uint64_t qux;
}
```

```ts
@unmanaged class Foo {
  bar: u32; // aligned to 4 bytes
  baz: u16; // aligned to 2 bytes
  qux: u64; // aligned to 8 bytes
}

offsetof<Foo>("bar") == 0
offsetof<Foo>("baz") == 4
offsetof<Foo>("qux") == 8
offsetof<Foo>() == 16

var foo = changetype<Foo>(ptrToFoo)
foo.bar // -> i32.load(ptrToFoo, 0)
foo.baz // -> i32.load16_u(ptrToFoo, 4)
foo.qux // -> i64.load(ptrToFoo, 8)
```

More complex structures usually require manual offset calculation, mostly for the reason that it is not feasible to implement something more specific into AssemblyScript as it does not use such structures on its own:

```c
struct Foo {
  int32_t bar;
  uint32_t baz[10];
}
```

```ts
@unmanaged class Foo {
  bar: i32
  getBaz(i: i32): u32 {
    return load<u32>(
      changetype<usize>(this) + (<usize>i << alignof<u32>()),
      4 // or use offsetof/sizeof to calculate the base offset plus alignment
    )
  }
}
```

## Calling convention

Exported functions will properly wrap return values, but functions not visible externally do not guarantee proper wrapping.

```ts
export function getU8(): u8 {
  return someU8 // will wrap to someU8 & 0xff
}
```

On the other hand, calling any AssemblyScript function does not require wrapping of arguments.

## Optional arguments

If a function exported from AssemblyScript accepts optional arguments, the `exports.__setArgumentsLength(numArguments)` helper must be called with the number of actual arguments (while zeroing all the others) to inform the varargs stub to fill in the default values of omitted arguments. The [loader](./loader.md) does this automatically.

## Garbage collection

Also see the dedicated page on [garbage collection](./garbage-collection.md).
