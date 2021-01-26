---
description: Are we there yet?
sidebarDepth: 2
---

# Status

Not all language features are equally viable to implement on top of WebAssembly's current capabilities, and while AssemblyScript is already useful today, there is also still a lot to do. Keep in mind that WebAssembly is an evolving technology, and so is AssemblyScript.

## WebAssembly features

Some crucial language features rely on [future WebAssembly functionality](https://github.com/WebAssembly/proposals) to be efficient. The following table aims to give an overview from a WebAssembly perspective:

| WebAssembly spec    | Engines                  | AssemblyScript (flag)   | What's the plan?
|---------------------|--------------------------|-------------------------|------------------------------------
| ✔️ **Finished proposal**
| Import/export mutable globals  | <C/> <F/> <S/> <N/> <W/> | ✔️           | Global variable interop
| BigInt integration  | <C/> <F/>           <W/><sup>1</sup> | ✔️          | 64-bit integer interop
| Non-trapping F2I    | <C/> <F/>      <N/> <W/> | ⏳                      | Checked and unchecked casts
| Sign-extension      | <C/> <F/>      <N/> <W/> | ⏳ `sign-extension`     | Efficient small integer casts
| Multi-value         | <C/> <F/> <S/>      <W/> |                         | Tuple return values?
|
| 🏁 **Standardize the feature**
| Reference Types     |      <F/>           <W/> | ⏳ `reference-types`    | Prerequisite for garbage collection
| Bulk memory         | <C/> <F/>           <W/> | ⏳ `bulk-memory`        | Replace `memcpy`, `memset`
|
| 🔨 **Implementation phase**
| Tail call           |                          |                         |
| Fixed-width SIMD    |                          | ⏳ `simd`               | Expose as built-ins; Auto-vectorize?
| Multiple memories   |                          |                         |
| Custom annotations  |                          |                         |
|
| 📖 **Spec text available** 
| Threads             | <C/> <F/>                | ⏳ `threads`            | Expose as built-ins; WebWorker?
| ESM integration     |                          |                         | Convenient web interop
| Exception handling  |                          | ⏳ `exception-handling` | Implement exceptions
| Function references |                          |                         | Implement closures
| Memory64            |                          | ⏳                      | Provide a Wasm64 target
|
| 💡 **Feature proposal**
| Type Imports        |                          |                         | Web interop?
| Garbage collection  |                          |                         | Reuse host GC; Share objects?
| Interface Types     |                          |                         | Non-web interop?
| Feature detection   |                          |                         |
| Extended name section |                        | ⏳                      | Debug names for locals etc.
| Flexible vectors    |                          |                         | Expose as built-ins
| Call Tags           |                          |                         |
| Module Linking      |                          |                         | Linking pre-compiled modules
| Branch hinting      |                          |                         | `likely(x)`, `unlikely(x)`?

<C/> Chrome &nbsp;
<F/> Firefox &nbsp;
<S/> Safari &nbsp;
<N/> Node.js &nbsp;
<W/> Wasmtime (<sup>1</sup> native i64 support)

## Language features

As such, certain higher-level language features still have their limitations or are not yet available. From a language perspective:

| Feature                | What to expect?
|------------------------|-----------------
| 🐤 **Functional**
| [Bootstrap](#bootstrap) | The compiler can compile itself to WebAssembly as a library, passing the test suite.
| [Classes and interfaces](#classes-and-interfaces) | Largely implemented in linear memory. Some caveats. (needs GC 🦄)
| [Standard library](#standard-library) | Largely implemented in linear memory. Some caveats.
| [Garbage collection](#garbage-collection) | Implemented in linear memory for now. (needs GC 🦄)
| [Interop with JS](#interop-with-js) | Enabled by the loader package. (needs Type imports / Interface Types 🦄)
| [Debugging](#debugging) | With debug info and source maps. (needs DWARF support)
|
| 🐣 **Limited**
| [Union types](#union-types) | Nullable class types only. Can use generics with static type checks instead. (No proposal so far)
| [Symbols](#symbols) | Implemented, but no deep compiler integration yet.
|
| 🥚 **Not implemented**
| [Closures](#closures) | Perhaps implement in linear memory. (needs Function references 🦄)
| [Iterators](#iterators) | Not implemented yet. Depends on symbols.
| [Rest parameters](#rest-parameters) | Perhaps implement in linear memory. (No proposal so far)
| [Exceptions](#exceptions) | Throwing currently aborts the program. (needs Exception handling 🦄)
| [Promises](#promises) | There is no concept of async/await yet due to the lack of an event loop. (No proposal so far)
| [BigInt](#bigint) | There are no BigInts yet, but there are i64s.
|
| 🕳️ **Not supported**
| [Dynamicness](#dynamicness) | AssemblyScript avoids overly dynamic JavaScript features by design.

### Bootstrap

> The #AssemblyScript compiler compiled to #WebAssembly using the AssemblyScript compiler compiled to WebAssembly now produces the exact same binary as the AssemblyScript compiler compiled to WebAssembly using the AssemblyScript compiler compiled to #JavaScript. ☯️ - Dezember 8, 2020

The first release based on the bootstrapping efforts is v0.18, released in January 2021. Note that the compiler is not technically "self hosted" in WebAssembly still, as it currently uses a JavaScript frontend for I/O and links to Binaryen (C++ compiled to WebAssembly with Emscripten), which again requires some JavaScript glue code. As such, to make the compiler work in a WebAssembly-only engine like Wasmtime, the next steps would be to work towards a WebAssembly-only build of Binaryen, and replace the I/O parts provided by `asc` with WASI.

### Classes and interfaces

These mostly work, with a a few caveats, in particular when it comes to interfaces. The easiest workaround is typically to use a class.

### Standard library

Some [standard library APIs](./stdlib/globals.md) function a little different than in JavaScript to account for differences introduced by static typing or missing WebAssembly features. We are also maintaining a [separate status document](https://github.com/AssemblyScript/assemblyscript/wiki/Status-and-Roadmap) specific to the standard library.

### Garbage collection

[Garbage collection](./garbage-collection.md) is currently implemented in linear memory, independent from the host, and is best paired with [the loader](./loader.md) for interop.

### Interop with JS

WebAssembly only understands numeric values as of today and cannot easily exchange objects with JavaScript. Hence, when an object is returned from WebAssembly to JavaScript, what the caller passes and the callee receives is a pointer to the object in linear memory. Note that WebAssembly does not know what to do with JavaScript objects passed to it, as the VM will implicitly convert the object to a number when it crosses the boundary, which is typically not what you want.

For example, to pass a string to a WebAssembly export, one first has to allocate the string in the WebAssembly module's linear memory, and then pass the resulting pointer to the WebAssembly export. The same is true for arrays and other objects.

For now, [the loader](./loader.md) provides the utility necessary to translate between objects in linear memory and JavaScript objects (e.g. with `__newString` and `__getString`), and our hopes are on Type Imports 🦄, Interface Types 🦄 and perhaps Garbage collection 🦄 to make interop more convenient eventually.

See also: [Will interop between AssemblyScript and JavaScript become better?](./frequently-asked-questions.md#will-interop-between-assemblyscript-and-javascript-become-better)

### Debugging

Debugging of AssemblyScript modules is still limited, but [possible to some extent](./debugging.md) with debug information and accompanying source maps. For a better debugging experience, we may eventually want to integrate with the [DWARF](http://dwarfstd.org) format used by for example LLVM, ideally through Binaryen.

### Union types

WebAssembly cannot efficiently represent locals or globals of dynamic types, so union types are not supported in AssemblyScript. One can however take advantage of the fact that AssemblyScript is a static compiler, with monomorphized generics and [static type checks](./environment.md#static-type-checks), to achieve a similar effect:

```ts
function addOrConcat<T>(a: T, b: T): T {
  return a + b; // concats if a string, otherwise adds
}

function addOrSomethingElse<T>(a: T, b: T): T {
  if (isString<T>()) {
    return "something else"; // eliminated if T is not a string
  } else {
    return a + b; // eliminated if T is a string
  }
}
```

Another effect of the above is that AssemblyScript does not have an `any` type or `undefined` value.

### Symbols

The standard library implements [`Symbol`](./stdlib/symbol.md), and it is possible to work with and create new symbols, but there is no deep compiler integration like registration of `Symbol.iterator` etc. yet.

### Closures

Closures (functions with a captured environment) are not yet supported and we are waiting for the Function References 🦄 and Garbage collection 🦄 (captured environments are GC'ed) proposals to land. However, since this is a crucial language feature, we may end up with a filler implementation using linear memory. Not available yet, though.

In the meantime we recommend to restructure code so closures are not necessary, i.e. instead of writing

```ts
function computeSum(arr: i32[]): i32 {
  var sum = 0
  arr.forEach(value => {
    sum += value // fails
  })
  return sum
}
```

restructure to

```ts
var sum: i32 // becomes a WebAssembly Global
function computeSum(arr: i32[]): i32 {
  sum = 0
  arr.forEach(value => {
    sum += value // works
  })
  return sum
}
```

or to

```ts
function computeSum(arr: i32[]): i32 {
  var sum = 0
  for (let i = 0, k = arr.length; i < k; ++i) {
    sum += arr[i] // works
  }
  return sum
}
```

### Iterators

It has not been attempted to implement iterators due to uncertainty how efficient iterators will be using frequent dynamic allocation. Also requires symbols for deep integration. Therefore `for ... of` loops are not currently supported. To work around the limitation of not having iterators, otherwise non-functional standard library APIs return an array for now:

#### Map\<K,V>

* ```ts
  function keys(): Array<K>
  ```

* ```ts
  function values(): Array<V>
  ```

#### Set\<T>

* ```ts
  function values(): Array<T>
  ```

### Rest parameters

It has not yet been attempted to implement variadic functions due to uncertainty how efficient it will be without random stack access. The risk is that doing dynamic allocations instead may introduce an unfortunate hidden cost to function calls.

In the meantime, optional function arguments, which do not have such a hidden cost, may be able to help:

```ts
function handleGiven(a: i32, b: i32 = -1, c: i32 = -1): void {
  handle(a);
  if (~b) {
    handle(b);
    if (~c) {
      handle(c);
    }
  }
}
```

### Exceptions

Exceptions are not yet supported and we are waiting for the Exception handling 🦄 proposal to land. It is not yet feasible to implement exceptions without the help of the proposal as throwing and catching an exception requires stack unwinding, so the following will currently crash the program with a call to `abort("message", ...)`:

```ts
function doThrow(): void {
  throw new Error("message")
}
```

In the meantime we recommend to do as they did in the olden days and return an error code or `null` to indicate an exception.

### Promises

The concept of async execution requires an underlying concept of an event loop, which browsers and Node.js have but WebAssembly does not. In the meantime, it is recommended to stick to synchronous code within WebAssembly or call back into WebAssembly when an external async operation completes.

### BigInt

We have favored the use of WebAssembly's native 64-bit integers over `BigInt`s and their `INTn` notation so far, since `BigInt`s can represent values > 64-bits and as such would have to be implemented as less-efficient heap allocated objects. There are certain use cases relying on representing more than 64-bits, of course, but we still have to figure out how to support both types without introducing conflicts.

### Dynamicness

AssemblyScript intentionally avoids very dynamic JavaScript features that cannot be compiled efficiently, like for example:

* Assigning any value to any variable.
* Compare values of incompatible types.
* Implicitly convert from a non-string to a string without using `x.toString()`.
* Assign a new property, that has not been statically declared, to a class or object.
* Assign a class to a variable (e.g. `var clazz = MyClass`) since classes are static constructs without a runtime representation.
* Patch class `.prototype`s since there are none.
* Access `arguments` to dynamically obtain function arguments.
* Dynamically obtain the name of a function at runtime or otherwise use reflection.

Some of these restrictions, like implicit conversion to strings when concatenating with a string, may be lifted in the future, while others, like prototypes, may never be viable in ahead-of-time compilation. For instance, some features would work in an interpreter and may become efficient with a JIT compiler, yet going down that rabbit hole runs counter to WebAssembly's, and by definition AssemblyScript's, goals.
