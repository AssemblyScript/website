---
description: How to talk to AssemblyScript from C or other languages.
---

# Interoperability

How to talk to AssemblyScript from C or other languages.

## Class layout

Layout of objects in memory resembles that of non-packed C structs, and `@unmanaged` classes \(not tracked by GC\) can be used to describe them:

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

## Garbage collection

All the rules described in the [managed runtime](./runtime.md) section apply here, except that unmanaged classes do not become tracked by GC and are merely views on a region of memory.
