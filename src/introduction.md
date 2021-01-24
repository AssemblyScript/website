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

Its architecture differs from a JavaScript VM in that it compiles a program **ahead of time**, quite similar to your typical C compiler. One can think of it as TypeScript syntax on top of WebAssembly instructions, statically compiled, to produce lean and mean WebAssembly binaries.

## In a nutshell

On top of [WebAssembly types](./types.md), AssemblyScript not only provides [low-level built-ins](./environment.md#low-level-webassembly-operations) to access WebAssembly features directly, making it suitable as a thin layer on top of Wasm, but also comes with its own JavaScript-like [standard library](./environment.md#standard-library) and a relatively small [memory management and garbage collection runtime](./garbage-collection.md), making it suitable as a general purpose higher-level language for WebAssembly today.

For example, on the lowest level, memory can be accessed using the `load<T>(offset)` and `store<T>(offset, value)` built-ins that compile to WebAssembly instructions directly

```ts
store<i32>(8, load<i32>(0) + load<i32>(4))
```

while the standard library provides higher-level implementations of [Array](./stdlib/array.md), [ArrayBuffer](./stdlib/arraybuffer.md), [DataView](./stdlib/dataview.md), [Math](./stdlib/math.md) (double and single precision), [Uint8Array](./stdlib/typedarray.md), [String](./stdlib/string.md), [Map](./stdlib/map.md), [Set](./stdlib/set.md) etc.:

```ts
var view = new Int32Array(12)
view[2] = view[0] + view[1]
```

It is worth to note, however, that AssemblyScript still has its [limitations](./basics.md#current-limitations) and a few implementation-specific [peculiarities](./peculiarities.md), and we are patiently waiting for [future WebAssembly features](#status) (marked as 🦄 throughout the documentation) to become available for us to use.

## Status

Not all TypeScript features are equally trivial or efficient to implement on top of the current state of WebAssembly. AssemblyScript is fun and useful already, yet there's still a lot to do. The following table aims at giving an overview of future WebAssembly features and their status, that will hopefully help AS reach its full potential eventually:

| WebAssembly         | Engines                  | AssemblyScript (flag)   | What's the plan?
|---------------------|--------------------------|-------------------------|------------------------------------
| ✔️ **Finished proposal**
| Import/export mutable globals | <C/> <F/> <S/> <N/> <W/> | ✔️           | Global variable interop
| BigInt integration  | <C/> <F/>      <N/> <W/> | ✔️                     | 64-bit integer interop
| Non-trapping F2I    | <C/> <F/>      <N/> <W/> | ⏳                      | Checked and unchecked casts
| Sign-extension      | <C/> <F/>      <N/> <W/> | ⏳ `sign-extension`     | Efficient casts
| Multi-value         | <C/> <F/> <S/> <N/> <W/> | ❌                     | Tuple returns?
|
| 🏁 **Standardize the feature**
| Reference Types     |      <F/>           <W/> | ⏳ `reference-types`    | Prerequisite for garbage collection
| Bulk memory         | <C/> <F/>      <N/> <W/> | ⏳ `bulk-memory`        | Replace `memcpy`, `memset`
|
| 🔨 **Implementation phase**
| Tail call           |                          | ❌                     |
| Fixed-width SIMD    |                          | ⏳ `simd`               | Expose as builtins, auto-vectorize?
| Multiple memories   |                          | ❌                     |
| Custom annotations  |                          | ❌                     |
|
| 📖 **Spec text available** 
| Threads             | <C/> <F/>                | ⏳ `threads`            | Expose as builtins, WebWorker?
| ESM integration     |                          | ❌                      | Convenient web interop
| Exception handling  |                          | ⏳ `exception-handling` | Implement `throw`, `try`, ...
| Typed function references |                    | ❌                     | Implement closures
| Memory64            |                          | ⏳                      | Separate Wasm64 target
|
| 💡 **Feature proposal**
| Type Imports        |                          | ❌                     | Efficient web interop?
| Garbage collection  |                          | ❌                     | Reuse host GC, share objects?
| Interface Types     |                          | ❌                     | Non-web interop?
| Feature detection   |                          | ❌                     |
| Extended name section |                        | ⏳                      | Debug names for locals etc.
| Flexible vectors    |                          | ❌                     | Expose as builtins
| Call Tags           |                          | ❌                     |
| Module Linking      |                          | ❌                     | Linking pre-compiled modules
| Branch hinting      |                          | ❌                     | `likely(x)`, `unlikely(x)`?

<C/> Chrome &nbsp;
<F/> Firefox &nbsp;
<S/> Safari &nbsp;
<N/> Node.js &nbsp;
<W/> Wasmtime
