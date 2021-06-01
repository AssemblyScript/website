---
description: Let's attempt the unthinkable, shall we?
sidebarDepth: 0
---

# Introduction

AssemblyScript compiles a **variant** of [TypeScript](https://www.typescriptlang.org) \(a typed superset of JavaScript\) to [WebAssembly](https://webassembly.org) using [Binaryen](https://github.com/WebAssembly/binaryen), looking like:

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

In its simplest form, it is JavaScript with [WebAsembly types](./types.md), compiled statically to a bunch of WebAssembly [exports and imports](./exports-and-imports.md), like so:

```sh
asc fib.ts --binaryFile fib.wasm --optimize
```

As such, it differs from running dynamically typed JavaScript (just in time) in that it instead [statically compiles](./compiler.md) to a strictly typed WebAssembly binary **ahead of time**, quite similar to what a traditional compiler would do. However, since it is deliberately designed to be very similar to JavaScript, it has the potential to integrate seamlessly with existing Web Platform concepts to produce lean and mean WebAssembly binaries, while also making it almost natural to use for those who are already familiar with writing code for the Web.

## Low-level perspective

AssemblyScript provides WebAssembly and compiler foundations as [low-level built-ins](./stdlib/builtins.md), making it suitable as a thin layer on top of raw WebAssembly. In fact, its standard library is implemented on top of just these foundations.

For example, memory can be accessed using the `load<T>(offset[, immOffset])` and `store<T>(offset, value[, immOffset])` built-ins that compile to WebAssembly instructions directly:

```ts
store<i32>(ptr, load<i32>(ptr) + load<i32>(ptr, 4), 8)
```

For comparision, the following C code is roughly equivalent:

```c
*(ptr + 8) = *ptr + *(ptr + 4)
```

## High-level perspective

On top of its low-level capabilities, AssemblyScript provides a JavaScript-like [standard library](./stdlib/globals.md) that is closely integrated with [memory management](/memory.md) and [garbage collection](./garbage-collection.md). The standard library provides implementations of many of the classes and namespaces one would expect from JavaScript, including [Math](./stdlib/math.md) (double and single precision), [Array](./stdlib/array.md), [String](./stdlib/string.md), [Map](./stdlib/map.md), [Typed arrays](./stdlib/typedarray.md) and so on.

The example above could look like this in idiomatic AssemblyScript:

```ts
var view = new Int32Array(12)
...
view[2] = view[0] + view[1]
```

## Setting realistic expectations

[Strictly typed](./basics.md#strictness) AssemblyScript differs a bit from idiomatic TypeScript, which even though typed, attempts to describe all the dynamic features of JavaScript, many of which cannot be efficiently compiled ahead of time. Not a blocker, but takes a bit to get used to.

Also, we are patiently waiting for [future WebAssembly features](./status.md) (marked as 🦄 throughout the documentation) to become available for us to use. In particular, we are looking forward to proposals that promise to improve WebAssembly's integration with the Web Platform, e.g. to more naturally and efficiently share strings, arrays and objects with JavaScript.

That being said, do you feel ready for a [quick start](./quick-start.md)?
