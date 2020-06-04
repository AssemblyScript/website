---
description: Recommendations on how to debug AssemblyScript modules.
---

# Debugging

Recommendations on how to debug AssemblyScript modules.

## Source maps

The compiler supports generating a source map alongside a binary using the `--sourceMap` option.

### Relative source maps

By default, specifying the `--sourceMap` option will create a source mapping section pointing to the source map with a relative path, defaulting to `myModule.wasm.map` with `myModule` being the name of the respective binary. This works when instantiating a module with [WebAssembly.instantiateStreaming](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/instantiateStreaming) because the VM can obtain the absolute URL the source map is relative to from the provided `Response` object, but does not work if a module is instantiated from a buffer or otherwise without a path context.

### Absolute source maps

Where relative source maps cannot be used, for example if [WebAssembly.instantiate](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/instantiate) is used to instantiate a module from a binary buffer, it is also possible to specify an absolute path to the source map using `--sourceMap absolutePathToSourceMap`.

## Stack traces

A JavaScript VM is able to display stack traces originating in WebAssembly code. However, optimizing a WebAssembly module will usually drop all the debug information, making these stack traces hard to grasp. Using an unoptimized module or a module otherwise preserving debug information can help here. The AssemblyScript compiler preserves debug information by specifying the `--debug` compiler option.

## Disabling assertions

By default, the compiler will preserve any `assert(expression)`s in a module, leading to an `abort` if one of the respective expectations failed. These assertions can be disabled with the `--noAssert` compiler option, though, essentially replacing them with `nop`s, doing nothing. Doing so can lead to smaller binaries once sufficiently confident that no assertions will be hit anyway, but also introduces the risk that a module explodes for no longer asserted reasons.

## Overriding `abort`

As mentioned above, assertions require that an implementation of the `abort` interface is present, which by default is imported as `abort` from within the `env` module, handling aborts externally. This can be overridden by specifying a custom abort handler through `--use abort=assembly/index/myAbort` \(here: a function named `myAbort` in `assembly/index.ts`\) or the abort interface can be disabled completely \(just trapping with an `unreachable`\) through `--use abort=`. The signature of the abort function, if overridden, is:

```ts
function abort(
  message: string | null,
  fileName: string | null,
  lineNumber: u32,
  columnNumber: u32
): void
```

## Manual tracing

The standard library provides a relatively basic `trace` utility function that is imported from the host and understood by the [loader](./loader.md). For example

```ts
trace("HERE", 2, value, otherValue)
```

will, by default, call the `trace` function imported from the `env` module with a string message and two arbitrary values that can be anything convertible to an `f64`. The loader for example will log the output to console. Similar to [overriding abort](./debugging.md#overriding-abort), the implementation can be overridden using the `--use` compiler option. Signature of the trace function is:

```ts
function trace(
  message: string,
  n: i32 = 0, // number of given parameters a0 to a4
  a0?: f64,
  a1?: f64,
  a2?: f64,
  a3?: f64,
  a4?: f64
): void
```

One thing to note here is that calling `trace` in top-level statements can lead to situations where [memory is accessed during instantiation](./memory.md#accessing-memory-during-instantiation), hence not being able to read the message without taking the respective precautions.

## Breakpoints

Some JavaScript engines also support adding break points when running WebAssembly binaries. Please consult your engine's documentation.

* [Chrome](https://developers.google.com/web/tools/chrome-devtools/javascript/breakpoints)
* [Firefox](https://developer.mozilla.org/en-US/docs/Tools/Debugger/How_to/Set_a_breakpoint)
* [node.js](https://nodejs.org/api/debugger.html)
* [Safari](https://support.apple.com/de-de/guide/safari-developer/dev5e4caf347/mac)

## Additional resources

* [Making Web Assembly Even Faster: Debugging Web Assembly Performance with AssemblyScript and a Gameboy Emulator](https://medium.com/@torch2424/making-web-assembly-even-faster-debugging-web-assembly-performance-with-assemblyscript-and-a-4d30cb6463f1) \(Aaron Turner, March 2018\)
