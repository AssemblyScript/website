---
description: Because nobody enjoys being bullied by malloc, free and friends.
---

# Runtime

The AssemblyScript runtime implements the necessary bits for memory management and garbage collection. It is largely invisible to a developer but can become relevant in advanced use cases, for example when integrating AssemblyScript in new environments.

::: tip
If not applicable to your use case, i.e. it is not necessary to interact with the runtime directly, you can safely skip this section.
:::

## Variants

The runtime comes in different flavors, each useful in different use cases. The desired runtime can be specified with the `--runtime` compiler option:

```
  --runtime             Specifies the runtime variant to include in the program.

                         incremental  TLSF + incremental GC (default)
                         minimal      TLSF + lightweight GC invoked externally
                         stub         Minimal runtime stub (never frees)
                         ...          Path to a custom runtime implementation

  --exportRuntime       Exports the runtime helpers (__new, __collect etc.).
```

The default `incremental` runtime provides the full package recommended in most use cases. The `minimal` runtime is a stripped down variant (no shadow stack, no heuristic, simpler algorithm, smaller and more efficient) that is not automated and requires calling `__collect` externally at appropriate times (when there are no more values on the WebAssembly stack, which would be the case when WebAssembly calls out to the host, directly or indirectly), whereas the `stub` runtime does not provide a garbage collector at all and never frees (simple bump allocation, extremely small).

For example, the `stub` runtime can be useful where modules are short-lived and collected as a whole anyhow, while the `minimal` runtime provides a compromise for use cases where it is sufficient to collect garbage manually, occasionally, say where a module performs a fixed amount of work before being invoked again.

In case of doubt, use `incremental`, but feel free to experiment with the other potentially more efficient variants where a use case permits.

## Interface

Using the `--exportRuntime` compiler option, the runtime interface can be exported from the module to the host, so it becomes possible to allocate new managed objects and invoke the garbage collector externally.

It is typically not necessary to invoke the runtime interface manually since generated bindings take care of all the internals. In environments where bindings are not yet available, however, the runtime interface can be utilized to provide the necessary integration.

* ```ts
  function __new(size: usize, id: u32): usize
  ```
  Allocates a new garbage collected instance of the object represented by the specified class id, of at least the specified size. Returns the pointer to the object (pointing at its data, not its internal header).

* ```ts
  function __pin(ptr: usize): usize
  ```
  Pins the object pointed to by `ptr` externally so it and any object it references do not become garbage collected. Note that the same object cannot be pinned more than once.

  An external object that is not referenced from within WebAssembly must be pinned whenever an allocation might happen in between allocating it and passing it to WebAssembly. If not pinned, the allocation may trigger the garbage collector to step, which would prematurely collect the object and lead to undefined behavior.

* ```ts
  function __unpin(ptr: usize): void
  ```
  Unpins the object pointed to by `ptr` externally so it can become garbage collected. Note that the respective object must have been pinned before for the unpin operation to succeed.

* ```ts
  function __collect(): void
  ```
  Performs a full garbage collection.

* ```ts
  const __rtti_base: usize
  ```
  Pointer to runtime type information in linear memory. RTTI contains information about the various classes utilized in a binary, mapping class ids to object kinds, their key and value layout, and base classes. Its layout is described in detail in [shared/typeinfo](https://github.com/AssemblyScript/assemblyscript/blob/main/std/assembly/shared/typeinfo.ts). Using RTTI, it becomes possible to implement `instanceof` for example, or to tell strings, arrays etc. apart.

## Memory layout

Overall, AssemblyScript partitions liner memory as follows:

| Region        | Start offset  | End offset            | Description
|---------------|---------------|-----------------------|-------------
| Static data   | `0`           | `__data_end`          | Contents of static strings, arrays, etc.
| Managed stack | `__data_end`  | `__heap_base`         | Present only if the incremental runtime is used.
| Heap          | `__heap_base` | `memory.size() << 16` | Remaining space is used for dynamic allocations. Can grow.

### Header layout

Any kind of managed object in AssemblyScript utilizes a managed header for the runtime to operate on:

| Name     | Offset | Type  | Description
| :------- | -----: | :---- | :----------
| mmInfo   |    -20 | usize | Memory manager info
| gcInfo   |    -16 | usize | Garbage collector info
| gcInfo2  |    -12 | usize | Garbage collector info
| rtId     |     -8 | u32   | Unique id of the concrete class
| rtSize   |     -4 | u32   | Size of the data following the header
|          |        |       |
|          |      0 |       | Payload starts here

References to an object always point at the start of the payload, with the header beginning in the 20 bytes before. Null references are just the value `0`. When working with an AssemblyScript module externally, knowing the memory layout can be helpful to for example obtain an object's class id or size. Invoking `__new` automatically prepends a managed header and registers the object with the GC, using the provided class id for `rtId` and the provided size for `rtSize`.

### Class layout

Class fields are laid out similarly to C structs, sequentially and without packing. Each field is aligned to its type's native alignment, potentially leaving padding in between. If a class has the `@unmanaged` decorator, it effectively only describes a region of memory as if it were a struct that does not utilize a managed header, is not garbage collected, and can be used with `heap.free`. Managed classes with a managed header cannot be manually freed, and managed and unmanaged classes cannot be mixed (e.g. extend from each other).

Standard library data types use the following layouts:

Class           | Description
----------------|-------------
ArrayBuffer     | Buffers always use class id `0`, with their untyped data as the payload.
String          | Strings always use class id `1`, with their 16-bit char codes (UTF-16 code units, allowing isolated surrogates like JS) as the payload. For example, if `rtSize` is `8`, the string's `.length` is `4`.
TypedArray      | Typed arrays are objects composed of `buffer` (the reference to the viewed `ArrayBuffer`), `dataStart` (the start pointer into `buffer`) and `byteLength` fields, in this order. The respective id is picked sequentially and not predetermined.
Array\<T>       | Normal arrays use the same layout as typed arrays, with an additional mutable `length` field coming last.
StaticArray\<T> | Static arrays do not need indirection due to not being resizable, and they have their data right in the payload, aligned according to `T`. Can be thought of as a typed buffer.
Function        | Functions are objects composed of their table `index` and their lexical `env` (currently always `0`).
Map/Set/...     | Other collection use more complex layouts. Please refer to their respective sources.

It is also possible to build custom data types that integrate with the GC by implementing the `__visit` interface (that iterates all references contained in an object of this kind). Please refer to the sources of preexisting data types for examples.

## Calling convention

AssemblyScript's calling convention is relatively straight forward, as it does not add additional parameters to functions or similar. Note that generated bindings take care of the calling convention automatically, but other environments may want to adhere to it specifically.

### Basic values

Exported functions wrap basic numeric return values to their respective value ranges. Basic numeric values passed to exported functions are wrapped to their respective value ranges on demand.

### Managed values

Any kind of object is passed as a pointer into memory, and the host is expected to perform the steps necessary to exchange the value between linear memory and the host system. For example, when a string is passed from WebAssembly to the host or vice-versa, it is not its data that is passed but a pointer to the string's data in linear memory. In order to read the data, the managed header before the payload can be evaluated to obtain the string's byte length. Note that [host bindings](./compiler.md#host-bindings) automate this process for common data types.

### Optional arguments

When an exported function allows one or multiple arguments to be omitted, the module must be informed of the number of significant arguments by calling `exports.__setArgumentsLength(numArgs)` before calling the export, so it can fill in default values. Omitted arguments are not evaluated, zeroes can be passed. Not calling the helper leads to undefined behavior. If a function has a fixed number of arguments, it is not necessary to call the helper. The helper may not be present if a module only exports functions with a fixed number of arguments.
