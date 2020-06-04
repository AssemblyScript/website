---
description: Let's attempt the unthinkable, shall we?
sidebarDepth: 0
---

# Introduction

AssemblyScript compiles a **strict variant** of [TypeScript](https://www.typescriptlang.org) \(a typed superset of JavaScript\) to [WebAssembly](https://webassembly.org) using [Binaryen](https://github.com/WebAssembly/binaryen), looking like:

```ts
export function fib(n: i32): i32 {
  var a = 0, b = 1
  if (n > 0) {
    while (--n) {
      let t = a + b
      a = b
      b = t
    }
    return b
  }
  return a
}

```

```sh
asc fib.ts -b fib.wasm -O3
```

Its architecture differs from a JavaScript VM in that it compiles a program **ahead of time**, quite similar to other static compilers. One can think of it as a mix of TypeScript's syntax and C's capabilities.

## In a nutshell

On top of [WebAssembly types](./types.md), it not only provides [low-level built-ins](./environment.md#low-level-webassembly-operations) to access WebAssembly features directly, making it suitable as a thin layer on top of Wasm, but also comes with its own JavaScript-like [standard library](./environment.md#standard-library), making it suitable for non-browser use cases, along a relatively small [managed runtime](./runtime.md) \(with memory management and garbage collection\) enabling the creation of programs that look and feel much like TypeScript.

For example, on the lowest level, memory can be accessed using the `load<T>(offset)` and `store<T>(offset, value)` built-ins that compile to WebAssembly instructions directly

```ts
store<i32>(8, load<i32>(0) + load<i32>(4))
```

while the standard library not only provides optimized native [Math](./stdlib/math.md) implementations \(both double and single precision\) but also implementations of [ArrayBuffer](./stdlib/arraybuffer.md), [Uint8Array](./stdlib/typedarray.md), [String](./stdlib/string.md), [Map](./stdlib/map.md) etc. on a higher level:

```ts
var view = new Int32Array(12)
view[2] = view[0] + view[1]
```

In turn it also comes with a bunch of features JavaScript doesn't have, mostly out of necessity, like the ability to declare [operator overloads](./peculiarities.md#operator-overloads) that arrays for example use as an implementation helper. It's not quite a subset, not quite a superset, but rather a variant.

As of today, the compiler still has its [limitations](./basics.md#current-limitations) and we are waiting for WebAssembly features that are currently undergoing specification \(marked as 🦄 throughout the documentation, especially [Reference Types](https://github.com/WebAssembly/reference-types) 🦄, [Interface Types](https://github.com/WebAssembly/interface-types) 🦄 and [Wasm GC](https://github.com/WebAssembly/gc) 🦄\) to unleash its full potential. But it is open source, built upon an [open specification](https://webassembly.github.io/spec/) and everyone can contribute, so we are getting there.

Sounds appealing to you? Read on!
