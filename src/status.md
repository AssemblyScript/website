---
description: Are we there yet?
---

# Implementation status

AssemblyScript both aims to be a thin and efficient layer on top of WebAssembly, as well as a language with familiar syntax for developers coming from TypeScript. These two goals are sometimes in conflict, since not all features are equally viable to implement on top of WebAssembly's capabilities *right now*, respectively applicable in general in ahead-of-time compilation. As such the focus is to implement what's feasible first, and where possible to delay features that are better served by one of the future WebAssembly proposals to avoid otherwise duplicate work. In a sense, the approach is similar to the MVP model used in WebAssembly specification. Some features are critical to make AssemblyScript work *right now* of course, so there are some exceptions to this rule.

## WebAssembly features

Some crucial language features rely on [future WebAssembly functionality](https://github.com/WebAssembly/proposals) to be efficient. The following table aims to give an overview from a WebAssembly perspective:

| WebAssembly spec                        | Engines                             | AssemblyScript (flag)   | Perspective
|-----------------------------------------|-------------------------------------|-------------------------|------------------------------------
| ✔️ **Finished proposal**
| [Import/export of mutable globals]      | <Ch/> <Fi/> <Sa/> <No/> <Wt/> <Ws/> | ✔️                      | <Badge text="good" type="tip"/> Interop
| [JS BigInt integration]<sup>1</sup>     | <Ch/> <Fi/> <Sa/> <No/> <Wt/> <Ws/> | ✔️                      | <Badge text="good" type="tip"/> Interop
| [Sign-extension operations]             | <Ch/> <Fi/> <Sa/> <No/> <Wt/> <Ws/> | ✔️                      | <Badge text="good" type="tip"/> Efficiency
| [Non-trapping float-to-int conversions] | <Ch/> <Fi/> <Sa/> <No/> <Wt/> <Ws/> | ✔️                      | <Badge text="good" type="tip"/> Efficiency
| [Bulk memory operations]                | <Ch/> <Fi/> <Sa/> <No/> <Wt/> <Ws/> | ✔️                      | <Badge text="good" type="tip"/> Efficiency
| [Fixed-width SIMD]                      | <Ch/> <Fi/> <Xx/> <No/> <Wt/> <Ws/> | 🏁 `simd`               | <Badge text="good" type="tip"/> Feature
| [Reference types]                       | <Ch/> <Fi/> <Sa/> <Xx/> <Wt/> <Ws/> | 🔨 `reference-types`    | <Badge text="good" type="tip"/> Interop
| [Multi-value]                           | <Ch/> <Fi/> <Sa/> <No/> <Wt/> <Ws/> |                         | <Badge text="uncertain" type="warning"/>
||
| 🏁 **Standardize the feature**
||
| 🔨 **Implementation phase**
| [Exception handling]                    | <Ch/> <Xx/> <Sa/> <Xx/> <Xx/> <Xx/> | 🔨 `exception-handling` | <Badge text="good" type="tip"/> Feature
| [Tail call]                             |                                     |                         | <Badge text="uncertain" type="warning"/>
| [Multiple memories]                     |                                     |                         | <Badge text="uncertain" type="warning"/>
| [Memory64]                              |                                     | 🔨                      | <Badge text="uncertain" type="warning"/>
| [Branch hinting]                        |                                     |                         | <Badge text="good" type="tip"/> Efficiency
| [Relaxed SIMD]                          |                                     |                         | <Badge text="good" type="tip"/> Feature
| [Extended constant expressions]         |                                     | 🔨                      | <Badge text="good" type="tip"/> Efficiency
||
| 📖 **Spec text available** 
| [Threads]                               | <Ch/> <Fi/> <Sa/> <No/> <Xx/> <Xx/> | 🔨 `threads`            | <Badge text="uncertain" type="warning"/>
| [ECMAScript module integration]         |                                     |                         | <Badge text="good" type="tip"/> Interop
| [Typed function references]             |                                     |                         | <Badge text="good" type="tip"/> Feature
| [Instrument and tracing]                |                                     |                         | <Badge text="good" type="tip"/> Debugging
| [Garbage collection]                    |                                     |                         | <Badge text="good" type="tip"/> Efficiency / Interop
| [JS Promise integration]                |                                     |                         | <Badge text="uncertain" type="warning"/>
||
| 💡 **Feature proposal**
| [Type imports]                          |                                     |                         | <Badge text="good" type="tip"/> Interop
| [Feature detection]                     |                                     |                         | <Badge text="uncertain" type="warning"/>
| [Extended name section]                 |                                     | 🔨                      | <Badge text="good" type="tip"/> Debugging
| [Flexible vectors]                      |                                     |                         | <Badge text="good" type="tip"/> Feature
| [Call tags]                             |                                     |                         | <Badge text="uncertain" type="warning"/>
| [Stack switching]                       |                                     |                         | <Badge text="good" type="tip"/> Feature / Interop
| [Constant time]                         |                                     |                         | <Badge text="good" type="tip"/> Security
| [Memory control]                        |                                     |                         | <Badge text="uncertain" type="warning"/>
| [Reference-typed strings]               |                                     |                         | <Badge text="good" type="tip"/> Interop
| [Interface types]<sup>2</sup>           |                                     |                         | <Badge text="harmful" type="error"/>
| [Module linking]<sup>2</sup>            |                                     |                         | <Badge text="harmful" type="error"/>
||
| ❔ **Quasi proposal**
| [WASI]<sup>3</sup>                      | <Xx/> <Xx/> <Xx/> <No/> <Wt/> <Ws/> | 🔨                      | <Badge text="harmful" type="error"/>

<Ch/> <a href="https://www.chromestatus.com/features#webassembly" target="_blank" rel="noopener">Chrome</a> &nbsp;
<Fi/> <a href="https://platform-status.mozilla.org" target="_blank" rel="noopener">Firefox</a> &nbsp;
<Sa/> <a href="https://webkit.org/status/" target="_blank" rel="noopener">Safari</a> &nbsp;
<No/> <a href="https://github.com/nodejs/node/blob/master/CHANGELOG.md" target="_blank" rel="noopener">Node.js</a> &nbsp;
<Wt/> <a href="https://docs.wasmtime.dev/stability-wasm-proposals-support.html" target="_blank" rel="noopener">Wasmtime</a> &nbsp;
<Ws/> <a href="https://docs.wasmer.io/ecosystem/wasmer/wasmer-features#support-of-features-by-compiler" target="_blank" rel="noopener">Wasmer</a> &nbsp; (<sup>1</sup> native support in non-JS hosts)

<sup>2</sup> Rescoped to the [Component Model], where [it has been decided](https://github.com/WebAssembly/interface-types/issues/135) that compatibility with JavaScript ([strings](./stdlib/string.md#considerations)) is out of scope.<br />
<sup>3</sup> WASI is not a good fit for the Web embedding and [there is no interest](https://github.com/WebAssembly/WASI/issues/401) to discuss or mitigate the risks of its approach.<br />

| Perspective                          | Description
|--------------------------------------|-------------
| <Badge text="good" type="tip"/>      | This specification is conceptually good and worth looking into
| <Badge text="uncertain" type="warning"/> | AssemblyScript is uncertain about this specification and not in a hurry to implement it
| <Badge text="harmful" type="error"/> | AssemblyScript considers this specification to be harmful in its current state

[Import/export of mutable globals]: https://github.com/WebAssembly/mutable-global
[JS BigInt integration]: https://github.com/WebAssembly/JS-BigInt-integration
[Sign-extension operations]: https://github.com/WebAssembly/sign-extension-ops
[Non-trapping float-to-int conversions]: https://github.com/WebAssembly/nontrapping-float-to-int-conversions
[Bulk memory operations]: https://github.com/WebAssembly/bulk-memory-operations
[Fixed-width SIMD]: https://github.com/webassembly/simd
[Reference types]: https://github.com/WebAssembly/reference-types
[Multi-value]: https://github.com/WebAssembly/multi-value
[Exception handling]: https://github.com/WebAssembly/exception-handling
[Tail call]: https://github.com/WebAssembly/tail-call
[Multiple memories]: https://github.com/WebAssembly/multi-memory
[Memory64]: https://github.com/WebAssembly/memory64
[Branch hinting]: https://github.com/WebAssembly/branch-hinting
[Relaxed SIMD]: https://github.com/WebAssembly/relaxed-simd
[Extended constant expressions]: https://github.com/WebAssembly/extended-const
[Threads]: https://github.com/webassembly/threads
[ECMAScript module integration]: https://github.com/WebAssembly/esm-integration
[Typed function references]: https://github.com/WebAssembly/function-references
[Instrument and tracing]: https://github.com/WebAssembly/instrument-tracing
[Garbage collection]: https://github.com/WebAssembly/gc
[JS Promise integration]: https://github.com/WebAssembly/js-promise-integration
[Type imports]: https://github.com/WebAssembly/proposal-type-imports
[Feature detection]: https://github.com/WebAssembly/feature-detection
[Extended name section]: https://github.com/WebAssembly/extended-name-section
[Flexible vectors]: https://github.com/WebAssembly/flexible-vectors
[Call tags]: https://github.com/WebAssembly/call-tags
[Stack switching]: https://github.com/WebAssembly/stack-switching
[Constant time]: https://github.com/WebAssembly/constant-time
[Memory control]: https://github.com/WebAssembly/memory-control
[Reference-typed strings]: https://github.com/WebAssembly/stringref
[Interface types]: https://github.com/WebAssembly/interface-types
[Module linking]: https://github.com/WebAssembly/module-linking
[Component Model]: https://github.com/WebAssembly/component-model
[WASI]: https://github.com/WebAssembly/WASI

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
