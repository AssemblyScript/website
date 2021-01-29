---
description: Everything about garbage collection in AssemblyScript.
sidebarDepth: 2
---

# Garbage Collection

::: tip NOTE
This section covers the new runtime added in AssemblyScript 0.18. The previous runtime documentation including migration guidelines [can be found here](./runtime.md).
:::

AssemblyScript implements garbage collection on top of linear memory while the WebAssembly [GC](https://github.com/WebAssembly/gc) 🦄 proposal is still in the works. More precisely it implements multiple runtime variants that are useful for different use cases, with the default being your typical memory manager and GC. The interface of the different variants is always the same, so these are interchangeable, yet differ in their level of sophistication. In case of doubt, starting out with the default is probably just fine.

## Runtime interface

Using the `--exportRuntime` compiler option, an interface to the runtime can be exported from the module to the host, so it becomes possible to allocate new objects and invoke the garbage collector externally.

* ```ts
  function __new(size: usize, id: u32): usize
  ```
  Allocates a new garbage collected instance of the object represented by the specified class id, of at least the specified size. Returns the pointer to the object, typically pointing at the object's data respectively its first field.

  Note that the [loader](./loader.md) provides more convenient wrappers like `__newString` and `__newArray` as well. `__new` is just the underlying implementation. The respective class id for the `id` argument can be obtained within WebAssembly via `idof<AClass>()`, typically exporting it to the host as a constant to use with `__new` or `__newArray`.

* ```ts
  function __pin(ptr: usize): usize
  ```
  Pins the object pointed to by `ptr` externally so it and its directly reachable members and indirectly reachable objects do not become garbage collected.

* ```ts
  function __unpin(ptr: usize): void
  ```
  Unpins the object pointed to by `ptr` externally so it can become garbage collected.

* ```ts
  function __collect(): void
  ```
  Performs a full garbage collection.

To interface with the runtime externally, for example to allocate objects in linear memory, you'll probably want to use the [loader](./loader.md) as well.

## Runtime variants

With the `--runtime` compiler option, one of multiple runtime variants can be selected, which determines the memory allocator and garbage collector included in a program:

```
  --runtime             Specifies the runtime variant to include in the program.

                         incremental  TLSF + incremental GC (default)
                         minimal      TLSF + lightweight GC invoked externally
                         stub         Minimal runtime stub (never frees)
                         ...          Path to a custom runtime implementation

  --exportRuntime       Exports the runtime helpers (__new, __collect etc.).
```

### Incremental runtime

This is the default runtime variant included in an AssemblyScript program, combining an Incremental Tri-Color Mark & Sweep (ITCMS) garbage collector with a Two-Level Segregate Fit (TLSF) memory manager. It is fully automated as one would expect from a typical GC, but its implementation has to go to lengths, involving some overhead, to polyfill functionality that is not yet provided by WebAssembly itself. It needs to maintain a shadow stack for example, and instruments binaries with it.

The incremental runtime is most suitable for non-trivial programs where short pause times are important, like in games, or where manually invoking the GC is not an option, like in WASI applications.

**Usage instructions**:

* When a managed object is exclusively referenced externally, `exports.__pin(objPtr)` it so it doesn't become collected when WebAssembly code executes (more precisely: performs an allocation).
* When the external object is not needed anymore, `exports.__unpin(objPtr)` it so it can become collected again.
* Note that a pinned object also keeps its directly reachable members and any indirectly reachable objects alive.
* It is safe to omit pinning an object externally if it is known to be referenced from within WebAssembly anyhow.
* It is possible to force a full collection (finishes current cycle, does another full cycle) using `exports.__collect()`, if so desired.

**Example usage:**

```js
function run() {
  let gameEnded = exports.updateGameProducingGarbage() // incrementally performs GC
  if (gameEnded) {
    exports.renderEndgameScreenProducingGarbage()
    exports.__collect() // optionally clean up the remains
  } else {
    requestAnimationFrame(run)
    exports.renderGameProducingGarbage() // incrementally performs GC
  }
}
run()
```

Careful pinning is particularly important when using the incremental runtime, since it may collect some garbage whenever an allocation happens within WebAssembly. Missing to pin an object may randomly result in use-after-free like errors otherwise that are notoriously hard to debug.

```js
var aPtr = exports.__pin(exports.__newString("hello")); // next line may collect
var bPtr = exports.__newString("world"); // allocates
var cPtr = exports.__pin(exports.stringConcat(aPtr, bPtr)); // puts args on stack
exports.__unpin(aPtr);
// ... do something with cPtr ...
exports.__unpin(cPtr);
```

### Minimal runtime

The minimal runtime is similar to the incremental runtime, except that it doesn't go to lengths to polyfill WebAssembly features that are not yet available. It features a simpler (non-incremental) Two-Color Mark & Sweep (TCMS) garbage collector on top of TLSF, making it a reasonable compromise.

The minimal runtime works best for use-cases where the GC can be invoked externally at appropriate places, that is when the WebAssembly execution stack is known to be fully unwound. The execution stack is typically unwound when `exports.__collect()` is invoked neither directly nor indirectly from WebAssembly, for example when invoking it from JavaScript only. The AssemblyScript compiler itself is a good candidate for the minimal runtime for example, as it does bounded amounts of work in bounded amounts of time, so it is sufficient to call `exports.__collect()` occasionally when specific phases of compilation are complete.

Unlike the incremental runtime, the minimal runtime does not run interleaved with the program but always does a full garbage collection cycle when invoked externally, stopping the program while doing so. It is important to not overdo invoking `exports.__collect()` to avoid marking a lot but sweeping little for that reason. In case of doubt, benchmark to find a reasonable sweet spot. However, when used wisely, the minimal runtime typically has better throughput than the incremental runtime.

**Usage instructions:**

* Whenever you see fit, invoke `exports.__collect()` externally to collect all garbage. Don't overdo calling it, though.
* When a managed object is exclusively referenced externally, `exports.__pin(objPtr)` it so it doesn't become collected when `exports.__collect()` is being invoked.
* When the external object is not needed anymore, `exports.__unpin(objPtr)` it so it can become collected again.
* Note that a pinned object also keeps its directly reachable members and any indirectly reachable objects alive.
* It is safe to omit pinning an object externally if
  * it is known to be referenced from within WebAssembly anyhow, directly or indirectly reachable from any root, like a global.
  * it is solely used as an argument to a WebAssembly function and not used externally anymore afterwards.
  * it is guaranteed that `exports.__collect()` will not be called while the object is alive.
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

An important usage difference between the incremental and the minimal runtime is in when it is necessary to pin objects. With the minimal runtime one has manual control about when the GC runs, so pinning is only necessary if a call to `exports.__collect()` may happen, while the incremental runtime may free an object whenever an allocation happens in WebAssembly code. For example, the following snippet works fine with the minimal runtime, but can randomly fail with the incremental runtime:

```js
var cPtr = exports.stringConcat(
  exports.__newString("hello"),
  exports.__newString("world")
);
// ... do something with cPtr ...
exports.__collect();
// don't use cPtr anymore
```

### Stub runtime

The stub is a maximally minimal runtime substitute, consisting of a simple and fast bump allocator with no means of freeing up memory again, except when freeing the respective most recently allocated object on top of the bump. As such, the stub runtime is useful where dynamic allocation, or garbage for that matter, is not a concern, for example because the program doesn't produce any or only executes a single time with a bounded limit of garbage before the entire module is terminated and collected by the host again.

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

### Custom runtime

Even though of limited usefulness, it is also possible to create a new runtime (essentially a memory manager and a garbage collector) from scratch and include it instead of one of the options provided by AssemblyScript itself. To do so, a custom runtime needs to provide the implementations of the externally visible interfaces like `__new`, plus the underlying interfaces like `__alloc` and `__free`, on top of compiler-generated functionality like `__visit_members`, as described in more detail in [the runtime's README](https://github.com/AssemblyScript/assemblyscript/tree/master/std/assembly/rt). Looking at the implementation of the relatively simple stub runtime before diving into the more sophisticated ones may be a good starting point.

* Runtimes typically include a general purpose memory manager to also drive `heap.alloc` and `heap.free`
* Garbage collection is precise, with compiler-generated visitors aware of what's a pointer and what's not
* The interface is tailored for tracing GCs, so attempts to implement other forms of GC may not be viable

## The future: WebAssembly GC

The WebAssembly [GC](https://github.com/WebAssembly/gc) 🦄 proposal is still in the works but our focus is to switch to it as soon as possible, hopefully making most of the above redundant and the overall experience more convenient.
