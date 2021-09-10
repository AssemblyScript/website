---
description: Are we there yet?
sidebarDepth: 2
---

# Implementation status

Not all language features are equally viable to implement on top of WebAssembly's current capabilities, and while AssemblyScript is already useful today, there is also still a lot to do. Keep in mind that WebAssembly is an evolving technology, and so is AssemblyScript.

## Philosophy

The original idea which made AssemblyScript attractive is that it aims to be a thin and efficient layer on top of WebAssembly with a familiar syntax, ultimately producing lean and mean binaries. This idea is composed of two components, however, that are sometimes orthogonal: **Lean and mean** implies that we have to stay close to WebAssembly's capabilities, i.e. not going too far already where implementations of certain language features would be inefficient or increase binary size disproportionately, while a **familiar syntax** naturally begs for supporting more of the original language right now.

As such, while AssemblyScript wants to stay as close as possible to being a language that feels very familiar with JavaScript and TypeScript developers, and aims to preserve compatiblity with existing tooling, it ultimately is a language compiling to WebAssembly and will prioritize language features that allow developers to write fast and small WebAssembly modules on top of the features that WebAssembly already provides.

## WebAssembly features

Some crucial language features rely on [future WebAssembly functionality](https://github.com/WebAssembly/proposals) to be efficient. The following table aims to give an overview from a WebAssembly perspective:

| WebAssembly spec               | Engines                             | AssemblyScript (flag)
|--------------------------------|-------------------------------------|----------------------
| ✔️ **Finished proposal**
| Import/export mutable globals  | <Ch/> <Fi/> <Sa/> <No/> <Wt/> <Ws/> | ✔️
| BigInt integration<sup>1</sup> | <Ch/> <Fi/> <Sa/> <No/> <Wt/> <Ws/> | ✔️
| Sign-extension                 | <Ch/> <Fi/> <Sa/> <No/> <Wt/> <Ws/> | ✔️
| Non-trapping F2I               | <Ch/> <Fi/> <Xx/> <No/> <Wt/> <Ws/> | 🏁 `nontrapping-f2i`
| Bulk memory                    | <Ch/> <Fi/> <Xx/> <No/> <Wt/> <Ws/> | 🏁 `bulk-memory`
| Fixed-width SIMD               | <Ch/> <Fi/> <Xx/> <No/> <Xx/> <Ws/> | 🏁 `simd`
| Reference Types                | <Xx/> <Fi/> <Xx/> <Xx/> <Wt/> <Ws/> | 🔨 `reference-types`
| Multi-value                    | <Ch/> <Fi/> <Sa/> <No/> <Wt/> <Ws/> |
||
| 🏁 **Standardize the feature**
||
| 🔨 **Implementation phase**
| Tail call                      |                                     |
| Multiple memories              |                                     |
| Memory64                       |                                     | 🔨
| Exception handling             |                                     | 🔨 `exception-handling`
||
| 📖 **Spec text available** 
| Threads                        | <Ch/> <Fi/> <Xx/> <No/> <Xx/> <Xx/> | 🔨 `threads`
| ESM integration                |                                     |
| Function references            |                                     |
| Branch Hinting                 |                                     |
| Instrument Tracing             |                                     |
||
| 💡 **Feature proposal**
| Type Imports                   |                                     |
| Garbage collection             |                                     |
| Feature detection              |                                     |
| Extended name section          |                                     | 🔨
| Flexible vectors               |                                     |
| Call Tags                      |                                     |
| Extended Constant Expressions  |                                     |
| Relaxed SIMD                   |                                     |
| Stack Switching                |                                     |
| Constant Time                  |                                     |
||
| **Unsure**
| WASI<sup>2</sup>               | <Xx/> <Xx/> <Xx/> <No/> <Wt/> <Ws/> | 🔨
| Interface Types<sup>3</sup>    |                                     |
| Module Linking<sup>3</sup>     | <Xx/> <Xx/> <Xx/> <Xx/> <Wt/> <Xx/> |

<Ch/> <a href="https://www.chromestatus.com/features#webassembly" target="_blank" rel="noopener">Chrome</a> &nbsp;
<Fi/> <a href="https://platform-status.mozilla.org" target="_blank" rel="noopener">Firefox</a> &nbsp;
<Sa/> <a href="https://webkit.org/status/" target="_blank" rel="noopener">Safari</a> &nbsp;
<No/> <a href="https://github.com/nodejs/node/blob/master/CHANGELOG.md" target="_blank" rel="noopener">Node.js</a> &nbsp;
<Wt/> <a href="https://docs.wasmtime.dev/stability-wasm-proposals-support.html" target="_blank" rel="noopener">Wasmtime</a> &nbsp;
<Ws/> <a href="https://docs.wasmer.io/ecosystem/wasmer/wasmer-features#support-of-features-by-compiler" target="_blank" rel="noopener">Wasmer</a> &nbsp; (<sup>1</sup> native support in non-JS hosts)

<sup>2</sup> WASI is [not a good fit](https://github.com/WebAssembly/WASI/issues/401) for AssemblyScript's use case currently and we would appreciate more cooperation.<br />
<sup>3</sup> The Wasm CG [has decided](https://github.com/WebAssembly/interface-types/issues/135) that [`DOMString`](https://developer.mozilla.org/en-US/docs/Web/API/DOMString) (ours and JS's `String`) is out of scope of Interface Types and Module Linking.

## Language features

As such, certain higher-level language features still have their limitations or are not yet available. From a language perspective:

| Feature                                           | What to expect?
|---------------------------------------------------|-----------------
| 🐤 **Functional**
| [Bootstrap](#bootstrap)                           | The compiler can compile itself to WebAssembly, passing the test suite.
| [Classes and interfaces](#classes-and-interfaces) | Largely implemented in linear memory. Some caveats.
| [Standard library](#standard-library)             | Largely implemented in linear memory. Some caveats.
| [Generics](#generics)                             | Monomorphized templates for now.
| [Garbage collection](#garbage-collection)         | Implemented in linear memory for now.
| [Interop with JS](#interop-with-js)               | Enabled by the loader package.
||
| 🐣 **Limited**
| [Union types](#union-types)                       | Nullable class types only. Can use generics with static type checks instead. (No proposal so far)
| [Symbols](#symbols)                               | Implemented, but no deep compiler integration yet.
| [Object literals](#object-literals)               | Implemented, but with limitations.
| [JSON](#json)                                     | Third-party library available.
| [RegExp](#regexp)                                 | Third-party library available.
| [Date](#date)                                     | Third-party library available.
||
| 🥚 **Not implemented**
| [Closures](#closures)                             | Perhaps implement in linear memory.
| [Iterators](#iterators)                           | Not implemented yet. Depends on symbols.
| [Rest parameters](#rest-parameters)               | Perhaps implement in linear memory. (No proposal so far)
| [Exceptions](#exceptions)                         | Throwing currently aborts the program.
| [Promises](#promises)                             | There is no concept of async/await yet due to the lack of an event loop. (No proposal so far)
| [BigInt](#bigint)                                 | There are no BigInts yet, but there are i64s.
||
| 🕳️ **Not supported**
| [Dynamicness](#dynamicness)                       | AssemblyScript avoids overly dynamic JavaScript features by design.

### Bootstrap

The first release able to bootstrap itself and pass the test suite is v0.18, released in January 2021. Note that the compiler is not technically "self hosted" in WebAssembly still, as it currently uses a JavaScript frontend for I/O and links to Binaryen (C++ with Emscripten), which also requires some JavaScript glue code. As such, to make the compiler work in a WebAssembly-only engine like Wasmtime, the next steps would be to work towards a WebAssembly-only build of Binaryen, and replace the I/O parts provided by `asc` with WASI.

### Classes and interfaces

These mostly work, with a a few caveats.

* Access modifiers like `private` and `protected` are not currently enforced. Likely to be enforced in the future.
* Interface fields must be implemented as getters and setters. Likely to be lifted in the future.
* Note that WebAssembly doesn't magically neglect the runtime cost of making extensive use of managed classes, so there are often faster alternatives.

### Standard library

Some [standard library APIs](./stdlib/globals.md) function a little different than in JavaScript to account for differences introduced by static typing or missing WebAssembly features. We are also maintaining a [separate status document](https://github.com/AssemblyScript/assemblyscript/wiki/Status-and-Roadmap) specific to the standard library.

### Generics

AssemblyScript compiles generics to one concrete method or function per set of unique contextual type arguments, also known as [monomorphisation](https://en.wiktionary.org/wiki/monomorphisation). Implications are that a module only includes and exports concrete functions for sets of type arguments actually used and that concrete functions can be shortcutted with [static type checks](./stdlib/builtins.md#static-type-checks) at compile time, which turned out to be quite useful.

* The compiler does not currently enforce `extends Y` clauses on type parameters. Likely to be enforced in the future.
* Concrete functions compiling to the exact same code are de-duplicated during optimization.

### Garbage collection

[Garbage collection](./garbage-collection.md) is currently implemented in linear memory, independent from the host, and is best paired with [the loader](./loader.md) for interop.

### Interop with JS

WebAssembly only understands numeric values as of today and cannot easily exchange objects with JavaScript. Hence, when an object is returned from WebAssembly to JavaScript, what the caller passes and the callee receives is a pointer to the object in linear memory. Note that WebAssembly does not know what to do with JavaScript objects passed to it, as the VM will implicitly convert the object to a number when it crosses the boundary, which is typically not what you want.

For example, to pass a string to a WebAssembly export, one first has to allocate the string in the WebAssembly module's linear memory, and then pass the resulting pointer to the WebAssembly export. The same is true for arrays and other objects.

For now, [the loader](./loader.md) provides the utility necessary to translate between objects in linear memory and JavaScript objects (e.g. with `__newString` and `__getString`).

### Union types

WebAssembly cannot efficiently represent locals or globals of dynamic types, so union types are not supported in AssemblyScript. One can however take advantage of the fact that AssemblyScript is a static compiler, with monomorphized generics and [static type checks](./stdlib/builtins.md#static-type-checks), to achieve a similar effect:

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

### Object Literals

Object literals can be used to create object instances as an alternative to the use of constructors. 

```ts
class MyClass {
  propOne: i32;
  propTwo: i32;
}

var myInstance: MyClass = { propOne: 2, propTwo: 3 };
```

Objects created via literals can have methods and default property values, but may not have a constructor.

### JSON

JSON integration in the compiler itself is still an open question due to its untyped nature. May require a mix of reflection and schema-specific code generation for natural integration.

Solutions being developed by the community:

* [nearprotocol/assemblyscript-json](https://github.com/nearprotocol/assemblyscript-json)

### RegExp

Regular expressions have been on our todo list for quite a while. It's mostly that a good implementation becomes complicated pretty quickly with special Unicode cases, exponential behavior and so on. Also, an ideal RegExp implementation would be compatible with the ECMAScript specification, reasonably fast and integrate deeply with the compiler, so RegExp literals can be pre-compiled (to WebAssembly code or an intermediate bytecode), making it unnecessary most of the time to ship the entire engine with a module.

Solutions being developed by the community:

* [ColinEberhardt/assemblyscript-regex](https://github.com/ColinEberhardt/assemblyscript-regex)

### Date

The JavaScript Date API is pretty poorly constructed, with limited support for timezones. AssemblyScript has a very limited Date implementation that just provides UTC methods and functionality. 

A new date, time and calendar API, called Temporal, is being actively developed and is currently at stage 3 of the TC39 process. This is a much better API for AssemblyScript to adopt. A solution is being developed by the community:

* [ColinEberhardt/assemblyscript-temporal](https://github.com/ColinEberhardt/assemblyscript-temporal)

### Closures

Closures (functions with a captured environment) are not yet supported. However, since this is a crucial language feature, we may end up with a filler implementation using linear memory. Not available yet, though.

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

Exceptions are not yet supported. Throwing and catching an exception requires stack unwinding, which is currently being specified, so the following will currently crash the program with a call to `abort("message", ...)`:

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

## Tooling features

| Feature                 | What to expect?
|-------------------------|-----------------
| 🐤 **Functional**
| [Debugging](#debugging) | Support for debug information and source maps. (needs DWARF support)
| [Testing](#testing)     | With assertions. Third-party library available.
||
| 🐣 **Limited**
| [Linting](#linting)     | Re-used TypeScript tooling. Third-party tooling available.

### Debugging

Debugging of AssemblyScript modules is not as convenient as it should be, but [possible with debug information and accompanying source maps](./debugging.md). For a better debugging experience, we may eventually want to integrate with the [DWARF](http://dwarfstd.org) format used by for example LLVM, ideally through Binaryen.

### Testing

The standard library provides the [`assert`](./stdlib/builtins.md#utility) built-in, which does not decide on a particular flavor of testing, yet is often sufficient to write basic tests.

Solutions being developed by the community:

* [jtenner/as-pect](https://github.com/jtenner/as-pect)

### Linting

AssemblyScript piggy-backs on top of TypeScript's excellent infrastructure currently, making it trivial to get started, but could need more sophisticated checking (as one types) for where code is valid TypeScript but not valid AssemblyScript or vice-versa with `// @ts-ignore`. It is still an open question whether a custom language server is needed (potentially with a separate file extension), or if a plugin on top of existing TypeScript tooling would be an equally viable option. The latter would imply having to reinvent fewer wheels, like code navigation and refactoring etc., while the former may feel more polished once all the wheels have been reinvented.

Solutions being developed by the community:

* [Shopify/asls](https://github.com/Shopify/asls)
