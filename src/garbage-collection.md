---
description: Everything about garbage collection in AssemblyScript.
sidebarDepth: 0
---

# Garbage Collection

::: tip NOTE
This section covers the new runtime added in AssemblyScript 0.18. The previous runtime documentation [can be found here](./runtime.md).
:::

While the WebAssembly [GC](https://github.com/WebAssembly/gc) 🦄 proposal is still in the works, AssemblyScript ships with multiple garbage collector runtimes implemented on top of linear memory that are useful for different use cases. Their interface is always the same, so these are interchangeable, yet differ in their level of sophistication.

## Runtime variants

With the `--runtime` compiler option, one of multiple runtime variantes can be selected, which determines the memory allocator and garbage collector included in a program:

```
  --runtime             Specifies the runtime variant to include in the program.

                         default      TLSF + lightweight GC invoked externally
                         incremental  TLSF + incremental GC (experimental)
                         stub         Minimal runtime stub (never frees)
                         ...          Path to a custom runtime implementation
```

Using the `--exportRuntime` compiler option, the runtime interface can be exported to the host to enable external allocation etc.

```
  --exportRuntime       Exports the runtime helpers (__new, __collect etc.).
```

To interface with the runtime externally, you'll probably want to use the [loader](./loader.md) as well.

## "Default" runtime

The default runtime provides a complete dynamic memory manager backing `new`, `heap.alloc`, `heap.realloc` and `heap.free` and is suitable for most non-interactive use cases where GC pause times are not a concern, but throughput is. One example for such a use case is the compiler itself, where there is a bounded amount of garbage produced during a bounded amount of work (here: parsing and compiling a program), and where it is fine to buffer garbage until performing a full GC at the end (here: after compiling a program) with maximum efficiency.

As such it aims at not bloating generated modules, i.e. as would be the case by going overboard with costly filler implementations for WebAssembly futures that are not yet available (for example utilizing a shadow stack). As a compromise, it has to be invoked manually (it is not automated), ideally externally, by calling `exports.__collect()` when the WebAssembly execution stack is known to be fully unwound.

It always performs a full garbage collection cycle, marking all reachable and sweeping all unreachable objects, and stops the program while doing so. Invoking garbage collection more often reduces the amount of garbage lingering around at any point in time, while invoking it less frequently increases throughput.

**Usage instructions:**

* Whenever you see fit, invoke `exports.__collect()` externally to collect all garbage. Note that this will mark & sweep all objects, so don't overdo calling it to avoid unnecessary overhead from marking a lot but sweeping little. In case of doubt, benchmark to find a reasonable sweet spot.
* When a managed object is exclusively referenced externally, `exports.__pin(objPtr)` it so it doesn't become collected when `exports.__collect()` is being invoked.
* When the external object is not needed anymore, `exports.__unpin(objPtr)` it so it can become collected again.
* It is safe to omit pinning an object externally if
  * it is known to be referenced from within WebAssembly anyhow, directly or indirectly reachable from any root, like a global.
  * it is solely used as an argument to a WebAssembly function and not used externally anymore afterwards.
  * it is guaranteed that `exports.__collect()` will not be called while it is alive.
* In case of doubt, pin.

**Example usage:**

```js
function compute(arg) {
  exports.doSomeHeavyWorkProducingGarbage(arg)
  ...
  exports.__collect() // clean up all garbage
}
compute(1)
compute(2)
compute(3)
```

## "Incremental" runtime

The "incremental" runtime is very similar to the "default" runtime, but extended with an automatic incremental mode. It does not require calling `exports.__collect()` manually (typically) but is instead automated at the Wasm->host boundary to automatically perform a reasonable amount of incremental garbage collection steps, instead of a full collection, to reduce pause times. It is meant as an alternative for highly interactive use cases, like games, where stopping the program for a full garbage collection cycle would take too long to catch the next frame, but it should be considered experimental at this point because automating GC at the boundary is unusual and may need additional tweaking on our end still. It may also be useful for programs running in non-JS hosts, for example where `exports.__collect()` may not be trivially callable, but other exports are.

The goal is again to avoid potentially costly filler implementations for not yet available WebAssembly features while still being useful today. The "incremental" runtime is slightly slower overall and slightly more complex to interface with than the "default" runtime due to needing to do more statekeeping work and not being as trivially controlled by hand.

**Usage instructions**:

* When a managed object is exclusively referenced externally, `exports.__pin(objPtr)` it so it doesn't become collected **when any WebAssembly export is called**.
* When the external object is not needed anymore, `exports.__unpin(objPtr)` it so it can become collected again.
* It is safe to omit pinning an object externally if
  * it is known to be referenced from within WebAssembly anyhow, directly or indirectly reachable from any root, like a global.
  * it is solely used as an argument to a WebAssembly function and not used externally anymore afterwards.
  * it is guaranteed that no **WebAssembly export** will be called while it is alive.
* In case of doubt, pin.
* It is still possible to force a full collection (finishes current cycle, does another full cycle) using `exports.__collect()`, if so desired.

**Example usage:**

```js
function run() {
  let gameEnded = exports.updateGameProducingGarbage() // may do a few GC steps
  if (gameEnded) {
    exports.renderEndgameScreenProducingGarbage()
    exports.__collect() // optionally clean up the remains
  } else {
    requestAnimationFrame(run)
    exports.renderGameProducingGarbage() // may do a few GC steps
  }
}
run()
```

## "Stub" runtime

A maximally minimal runtime stub not providing any means of collecting garbage again. Includes just a simple (but fast) bump allocator and no GC. This one is useful where dynamic allocations, or garbage for that matter, is not a concern, for example because the program doesn't produce any or only executes a single time with a bounded limit of garbage before the entire module, incl. any potential garbage, is terminated and collected by the host again.

**Usage instructions**:

* Since the stub runtime never frees memory, there is nothing special to take care of except that it leaks memory by design.

**Example usage**:

```js
function compute() {
  exports.doSomeHeavyWorkProducingGarbage()
}
compute()
// throw away the entire module instance
```

# Runtime interface

Using the `--exportRuntime` compiler option, an interface to the runtime can be exported from the module to the host, so it becomes possible to perform allocations and invoke the garbage collector externally.

* ```ts
  function __new(size: usize, id: u32): usize
  ```
  Allocates a new garbage collected instance of the object represented by the specified class id, of at least the specified size. Returns the pointer to the object, typically pointing at the object's data respectively its first field.

  Note that the [loader](./loader.md) provides more convenient wrappers like `__newString` and `__newArray` as well. `__new` is just the underlying implementation. The respective class id for the `id` argument can be obtained within WebAssembly via `idof<MyClass>()`, typically exporting it to the host as a constant to use with `__new` or `__newArray`.

* ```ts
  function __pin(ptr: usize): usize
  ```
  Pins the object pointed to by `ptr` externally so it does not become garbage collected.

* ```ts
  function __unpin(ptr: usize): void
  ```
  Unpins the object pointed to by `ptr` externally so it can become garbage collected.

* ```ts
  function __collect(): void
  ```
  Performs a full garbage collection. Requires that the WebAssembly execution stack is fully unwound when invoked, which is the case when invoking it externally, i.e. not directly or indirectly called from WebAssembly.

## The future: WebAssembly GC

The WebAssembly [GC](https://github.com/WebAssembly/gc) 🦄 proposal is still in the works but our focus is to switch to it as soon as possible, hopefully making most of the above redundant. Until then, and while we're patiently waiting, the above is what we got to keep matters reasonably lean & mean for now.
