---
description: Are we there yet?
sidebarDepth: 2
---

# Status

Not all language features are equally viable to implement on top of WebAssembly's current feature set. There is still a lot to do.

## WebAssembly features

Some crucial language features rely on not yet available WebAssembly functionality to be efficient. The following table aims to give an overview from a WebAssembly perspective:

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
| Classes and interfaces | Largely implemented in linear memory. Some caveats. (GC 🦄)
| Garbage collection     | Implemented in linear memory for now. (GC 🦄)
| Interop with JS        | Enabled by the [loader](./loader.md). (GC / Type imports / Interface Types 🦄)
|
| 🐣 **Limited**
| Union types            | Nullable classes only. Can use generics with [static checks](./environment.md#static-type-checks) instead. (No proposal so far)
|
| 🥚 **Not implemented**
| Closures               | Perhaps implement in linear memory. (Function references 🦄)
| Rest parameters        | Perhaps implement in linear memory. (No proposal so far)
| Exceptions             | Throwing currently aborts the program. (Exception handling 🦄)

### Classes and interfaces

These mostly work, with a a few caveats, especially when it comes to interfaces. The easiest workaround is typically to use a class.

### Interop with JS

WebAssembly only understands numeric values as of today and cannot easily exchange objects with JavaScript. Hence, when an object is returned from WebAssembly to JavaScript or vice-versa, what the caller passes and the callee receives is a pointer to the object in linear memory. For now, [the loader](./loader.md) provides the utility necessary to translate between objects in linear memory and JavaScript objects, and our hopes are on Type Imports 🦄, Interface Types 🦄 and perhaps Garbage collection 🦄 to make interop more convenient eventually.

### Union types

WebAssembly cannot efficiently represent locals or globals of dynamic types, so union types are not supported in AssemblyScript. One can however take advantage of the fact that AssemblyScript is a static compiler, with monomorphized generics, to achieve a similar effect:

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

### Rest parameters

It has not yet been attempted to implement variadic functions since an eventual filler implementation would probably need to allocate arrays, which is an unfortunate hidden cost as far as function calls are concerned.

### Exceptions

Exceptions are not yet supported and we are waiting for the Exception handling 🦄 proposal to land. It is not yet feasible to implement exceptions without the help of the proposal, so the following will currently crash the program with a call to `abort("message", ...)`:

```ts
function doThrow(): void {
  throw new Error("message")
}
```

In the meantime we recommend to do as they did in the olden days and return an error code or `null` to indicate an exception.
