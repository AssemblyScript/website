---
description: Let's attempt the unthinkable, shall we?
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
```sh
asc fib.ts --outFile fib.wasm --optimize
```

It is similiar to TypeScript but with **WebAssembly types**, has some constraints due to compiling **strictly typed** code **ahead of time**, but also some additions originating in WebAssembly's feature set. While not all of TypeScript can be supported, its close relation to JavaScript makes it a familiar choice for developers who are already used to writing code for the Web, and also has the potential to integrate seamlessly with existing Web Platform concepts to produce lean and mean WebAssembly modules.

## From a WebAssembly perspective

AssemblyScript provides WebAssembly and compiler foundations as [built-in functions](./stdlib/globals.md#builtins), making it suitable as a thin layer on top of raw WebAssembly. For example, memory can be accessed using built-in functions that compile to WebAssembly instructions directly:

```ts
store<i32>(ptr, load<i32>(ptr) + load<i32>(ptr, 4), 8)
```

For comparison, the following C code is roughly equivalent:

```c
*(ptr + 2) = *ptr + *(ptr + 1)
```

Most WebAssembly instructions can also be written directly in AssemblyScript code, with generic variants available as well:

```ts
i32.ctz(...)             // ctz<i32>(...)
f64.reinterpret_i64(...) // reinterpret<f64>(...)
i64.load32_u(...)        // <i64>load<u32>(...)
...
```

## From a JavaScript perspective

Implemented on top of its low-level capabilities, AssemblyScript provides a JavaScript-like [standard library](./stdlib/globals.md) with many of the classes and namespaces one is used to from JavaScript, including `Math` (also `Mathf` for single precision), `Array<T>`, `String`, `Map<K,V>`, the typed arrays and so on.

The load/store example above could look like this when utilizing the standard library:

```ts
var view = new Int32Array(12)
...
view[2] = view[0] + view[1]
```

Both perspectives can be mixed depending on whether low-level control with WebAssembly instructions or idiomatic concepts with the managed standard library are desirable to accomplish an individual task.

## Frequently asked questions

::: tip Does AssemblyScript involve an interpreter, or a "VM in a VM"?
No, AssemblyScript compiles to WebAssembly bytecode directly, statically, ahead-of-time.
:::

::: tip What are the differences between AssemblyScript and TypeScript?
TypeScript transpiles down to JavaScript, a dynamic just-in-time compiled language. AssemblyScript, on the other hand, compiles to a static WebAssembly binary. Their compiler implementations are quite different. However, the two languages are so very similar on the surface that they share many concepts. For example, TypeScript tooling can be used to author and refactor AssemblyScript code and, with some effort, the same code base can be transpiled to JavaScript with `tsc` and compiled to WebAssembly with `asc`, or code shared. The AssemblyScript compiler itself is portable.
:::

::: tip Will AssemblyScript support all of TypeScript eventually?
It likely won't. While TypeScript adds typings to JavaScript, it is a superset after all and can describe many of JavaScript's dynamic features, not all of which are feasible to support in ahead-of-time compilation. Yet, sufficiently strict TypeScript code can often be made compatible with the AssemblyScript compiler with little effort.
:::

::: tip Can I use any third party npm package like web.js or crypto.js?
It depends. Even if the npm package has TypeScript sources that are fully compatible with AssemblyScript, bundlers / transpilers will likely compile it into regular JavaScript without without proper information about the types after publishing to npm. However, you can use packages from npm that are built specifically for AssemblyScript. Some of them can be found at [Built with AssemblyScript](./built-with-assemblyscript.md). Furthermore, you can always import the necessary JavaScript methods from the host (browser or node.js) via [host bindings](./compiler.html#host-bindings).
:::

::: tip What are good use cases for AssemblyScript?
Computation-heavy logic like image manipulation, hot game logic, specialized algorithms, emulators, compilers and the likes are great use cases for WebAssembly, and as such for AssemblyScript as well. In some situations it may also be preferable to ship bytecode instead of minified JS, or just the ability to utilize a TypeScript-like language may open up new opportunities, for example for embedded scripting or plugins.
:::

::: tip Can AssemblyScript be used in non-standard ways, say outside of the browser?
Absolutely! AssemblyScript modules are self-contained and run anywhere where WebAssembly is supported. In fact, any arbitrary host interface can be supported. Here is an [example of using WASI imports instead of Web APIs](https://github.com/AssemblyScript/wasi-shim).
:::

::: tip Why the strange name?
AssemblyScript is to Assembly as JavaScript is to Java. Not quite.
:::

But now, let's [get started](./getting-started.md)!
