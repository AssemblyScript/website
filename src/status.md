---
description: Are we there yet?
---

# Implementation status

AssemblyScript both aims to be a thin and efficient layer on top of WebAssembly, as well as a language with familiar syntax for developers coming from TypeScript. These two goals are sometimes in conflict, since not all features are equally viable to implement on top of WebAssembly's capabilities *right now*, respectively applicable in general in ahead-of-time compilation. As such the focus is to implement what's feasible first, and where possible to delay features that are better served by one of the future WebAssembly proposals to avoid otherwise duplicate work. In a sense, the approach is similar to the MVP model used in WebAssembly specification. Some features are critical to make AssemblyScript work *right now* of course, so there are some exceptions to this rule.

## WebAssembly features

Some crucial language features rely on [future WebAssembly functionality](https://github.com/WebAssembly/proposals) to be efficient. The following table aims to give an overview from a WebAssembly perspective:

| WebAssembly spec               | Engines                             | AssemblyScript (flag)   | What's the plan?
|--------------------------------|-------------------------------------|-------------------------|------------------------------------
| ✔️ **Finished proposal**
| Import/export mutable globals  | <Ch/> <Fi/> <Sa/> <No/> <Wt/> <Ws/> | ✔️                      | Global variable interop
| BigInt integration<sup>1</sup> | <Ch/> <Fi/> <Sa/> <No/> <Wt/> <Ws/> | ✔️                      | 64-bit integer interop
| Sign-extension                 | <Ch/> <Fi/> <Sa/> <No/> <Wt/> <Ws/> | ✔️                      | Efficient small integer casts
| Non-trapping F2I               | <Ch/> <Fi/> <Sa/> <No/> <Wt/> <Ws/> | ✔️                      | Trap-free casts
| Bulk memory                    | <Ch/> <Fi/> <Sa/> <No/> <Wt/> <Ws/> | ✔️                      | Use for `memcpy`, `memset`
| Fixed-width SIMD               | <Ch/> <Fi/> <Xx/> <No/> <Xx/> <Ws/> | 🏁 `simd`               | Expose as built-ins
| Reference Types                | <Ch/> <Fi/> <Sa/> <Xx/> <Wt/> <Ws/> | 🔨 `reference-types`    | Road to JS integration
| Multi-value                    | <Ch/> <Fi/> <Sa/> <No/> <Wt/> <Ws/> |                         | Tuple return values
||
| 🏁 **Standardize the feature**
||
| 🔨 **Implementation phase**
| Exception handling             | <Ch/> <Xx/> <Sa/> <Xx/> <Xx/> <Xx/> | 🔨 `exception-handling` | Implement exceptions
| Tail call                      |                                     |                         |
| Multiple memories              |                                     |                         |
| Memory64                       |                                     | 🔨                      | Provide a Wasm64 target
| Branch Hinting                 |                                     |                         | `likely(x)` / `unlikely(x)` hints
||
| 📖 **Spec text available** 
| Threads                        | <Ch/> <Fi/> <Sa/> <No/> <Xx/> <Xx/> | 🔨 `threads`            | Expose as built-ins; WebWorker?
| ESM integration                |                                     |                         | Natural web interop
| Function references            |                                     |                         | Implement closures
| Instrument Tracing             |                                     |                         | `debugger` statement?
| Relaxed SIMD                   |                                     |                         | Expose as built-ins
||
| 💡 **Feature proposal**
| Type Imports                   |                                     |                         | Web interop?
| Garbage collection             |                                     |                         | Reuse host GC; Share objects?
| Feature detection              |                                     |                         | Detect available features
| Extended name section          |                                     | 🔨                      | Debug names for locals etc.
| Flexible vectors               |                                     |                         | Expose as built-ins
| Call Tags                      |                                     |                         | Speed up indirect calls
| Extended Constant Expressions  |                                     |                         | Inline more global initializers
| Stack Switching                |                                     |                         | `async` / `await`
| Constant Time                  |                                     |                         | Expose as built-ins / hint
| Interface Types                |                                     | Harmful<sup>2</sup> | *No `DOMString` support*
| Module Linking                 | <Xx/> <Xx/> <Xx/> <Xx/> <Wt/> <Xx/> |                         | *Requires Interface Types*
||
| **Quasi proposal**
| WASI                           | <Xx/> <Xx/> <Xx/> <No/> <Wt/> <Ws/> | 🔨 Harmful<sup>3</sup> | *Not a good fit (double-polyfill)*

<Ch/> <a href="https://www.chromestatus.com/features#webassembly" target="_blank" rel="noopener">Chrome</a> &nbsp;
<Fi/> <a href="https://platform-status.mozilla.org" target="_blank" rel="noopener">Firefox</a> &nbsp;
<Sa/> <a href="https://webkit.org/status/" target="_blank" rel="noopener">Safari</a> &nbsp;
<No/> <a href="https://github.com/nodejs/node/blob/master/CHANGELOG.md" target="_blank" rel="noopener">Node.js</a> &nbsp;
<Wt/> <a href="https://docs.wasmtime.dev/stability-wasm-proposals-support.html" target="_blank" rel="noopener">Wasmtime</a> &nbsp;
<Ws/> <a href="https://docs.wasmer.io/ecosystem/wasmer/wasmer-features#support-of-features-by-compiler" target="_blank" rel="noopener">Wasmer</a> &nbsp; (<sup>1</sup> native support in non-JS hosts)

<sup>2</sup> The Wasm CG [has decided](https://github.com/WebAssembly/interface-types/issues/135) that compatibility with JavaScript (strings) is out of scope of the Component Model. We are also looking with sorrow at the very close relation to just one of many programming languages in both concept and syntax. [See also](./stdlib/string.md#considerations).<br />
<sup>3</sup> WASI is [not a good fit](https://github.com/WebAssembly/WASI/issues/401) for AssemblyScript and the Web in general and we would appreciate cooperation instead. It is also the driver behind the Component Model, which introduces incompatibility with the existing Web throughout all of WebAssembly.

## Language features

As such, certain higher-level language features still have their limitations or are not yet available. From a language perspective:

| Feature                                           | What to expect?
|---------------------------------------------------|-----------------
| 🐤&nbsp;**Functional**
| Bootstrap                                         | The compiler can compile itself to WebAssembly, passing the test suite. Note that the compiler is not technically "self hosted" in WebAssembly yet, as it currently uses a JavaScript frontend for I/O and links to Binaryen (C++ compiled with Emscripten), which again requires some amount of JS glue code.<br />
| OOP                                               | Largely implemented in linear memory. Access modifiers like `private` and `protected` are not currently enforced. There is rudimentary support for interfaces. Interfaces must specify getters instead of fields.
| Standard&nbsp;library                                  | Largely implemented in linear memory. Some APIs function a little different than in JavaScript due to differences introduced by static typing or not yet available future features. There is a [separate status document](https://github.com/AssemblyScript/assemblyscript/wiki/Status-and-Roadmap) specific to the standard library.
| Generics                                          | Generics are compiled as monomorphized templates for now and can be specialized with [static type checks](./stdlib/globals.md#static-type-checks). Constraining `extends XY` clauses are not yet enforced.
| Garbage&nbsp;collection                                | Implemented in linear memory for the time being, independent of the host GC.
| Host&nbsp;integration                                  | Enabled by generated [host bindings](./compiler.md#host-bindings), respectively the [runtime interface](./runtime.md) for integration into non-Web environments.
||
| 🐣&nbsp;**Limited**
| Union&nbsp;types                                  | Union types are not supported by design, except for nullable class types. There is no `any` type. A viable alternative is to use generics specialized with [static type checks](./stdlib/globals.md#static-type-checks) to achieve a similar effect.
| Symbols                                           | Symbols are implemented in the standard library, but don't have deep compiler integration yet.
| Object literals                                   | Object literals can be used in places where the current type is a bare class, then corresponding to an instantiation of the class.
| JSON                                              | JSON is not strictly typed in nature, so we haven't settled on a standard yet. Solutions developed by the community: [assemblyscript-json](https://github.com/nearprotocol/assemblyscript-json)
| RegExp                                            | Regular expressions need quite a lot of supporting code with many quirks, and we haven't decided on an implementation yet. Solutions developed by the community: [assemblyscript-regex](https://github.com/ColinEberhardt/assemblyscript-regex)
| Date                                              | There is initial support for the UTC parts, but WebAssembly lacks access to the system's time zone data. In general the Temporal proposal could be more feasible to adopt. Solutions developed by the community: [assemblyscript-temporal](https://github.com/ColinEberhardt/assemblyscript-temporal).
||
| 🥚&nbsp;**Not&nbsp;implemented**
| Closures                                          | Captures of local variables are not yet supported and would be best implemented on top of future WebAssembly features, also to avoid inventing a custom ABI. Can be worked around by using a global variable instead (does not need to be captured), or passing an argument with the relevant values.
| Iterators                                         | Iterators and `for..of` loops are not supported yet. APIs that would return an iterator return an array of keys or values for now instead.
| Rest parameters                                   | Rest parameters are not supported yet. Would benefit from a WebAssembly proposal to avoid a custom ABI, but there is none yet. Optional parameters with a default value are supported and can often be used as an alterantive.
| Exceptions                                        | Exceptions require support from the WebAssembly engine first. Throwing currently aborts the program.
| Promises                                          | There is no concept of async/await yet due to the lack of an event loop. Future WebAssembly proposals might help with the stack switching parts (pause and resume execution).
| BigInt                                            | Instead of BigInts, AssemblyScript has opted to utilize WebAssembly's 64-bit integers. It is currently unclear how both concepts could mix.
||
| 🕳️&nbsp;**Not&nbsp;supported**
| Dynamicness                                       | AssemblyScript avoids overly dynamic JavaScript features by design and focuses on static compilation.

### On closures

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

### On dynamicness

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

## Tooling features

| Feature                 | What to expect?
|-------------------------|-----------------
| 🐤&nbsp;**Functional**
| Debugging               | There is support for debug information and source maps. [See also](./compiler.md#debugging-2).
| Testing                 | Unopinionated with simple assertions. Solutions developed by the community: [as-pect](https://github.com/jtenner/as-pect)
||
| 🐣&nbsp;**Limited**
| Linting                 | AssemblyScript re-uses TypeScript tooling with a `// @ts-ignore` here or there but would benefit from a dedicated language server eventually. Solutions developed by the community: [asls](https://github.com/Shopify/asls)
