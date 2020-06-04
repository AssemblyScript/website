---
description: How to import and export memory, and all the details on its layout.
---

# Memory

Similar to other languages that use linear memory, all data in AssemblyScript becomes stored at a specific memory offset so other parts of the program can read and modify it.

## Importing memory

The [WebAssembly.Memory](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/Memory) instance used by your program can be imported from the host by using the `--importMemory` flag on the command line. The module will then expect an import named `memory` within the `env` module. An imported memory becomes the singleton memory of the module and can be accessed in the same way as a non-imported memory. One thing to take care of is that if the module defines `data` segments, it will place these into the imported memory upon instantiation of the module, which must be taken into account when pre-populating the memory externally \(i.e., utilize`--memoryBase` to reserve some space as described in [Memory Regions](./memory.md#memory-regions) below\). Likewise, a module exports its memory as `memory` by default, unless disabled with `--noExportMemory`.

## Accessing memory during instantiation

There is one special case to mention when it comes to accessing memory while top-level statements are still executing. Instantiation must return first so one can get a hold of the exported memory instance, hence it is not possible to print a string externally before this happens, _unless_ memory has been imported or an explicit start function has been exported using the `--explicitStart` option.

Using the `--explicitStart` option essentially delays all top-level statements until `_start` is called externally, which must happen before calling any other exports, so one can get a hold of the memory early, before top-level statements run, even if it has not been imported.

## Memory regions

Internally, there are two regions of memory the compiler is aware of:

### Static memory

Memory starts with static data, like strings and arrays \(of constant values\) the compiler encountered while translating the program. Unlike in other languages, there is no concept of a stack in AssemblyScript and it instead relies on WebAssembly's execution stack exclusively.

A custom region of memory can be reserved using the `--memoryBase` option. For example, if one needs an image buffer of exactly N bytes, instead of allocating it one could reserve that space, telling the compiler to place its own static data afterwards, partitioning memory in this order:

| Region          | Description
| :-------------- | :----------
| Reserved memory | As specified with `--memoryBase`
| Static memory   | Starting right after reserved memory
| Dynamic memory  | Starting right after static memory

### Dynamic memory

Dynamic memory, commonly known as the heap, is managed by the [AssemblyScript runtime](./runtime.md), at runtime. When a chunk of memory is requested by the program, the runtime's memory manager reserves a suitable region and returns a pointer to it to the program. The lifetime of objects allocated from the heap is then tracked by the runtime's garbage collector, and once it is not needed anymore, the object's chunk of memory is returned to the memory manager for reuse.

## Internals

When writing high level AssemblyScript, the above is pretty much everything one needs to know. But there is a low level perspective of course.

When implementing low-level code, the end of static memory respectively the start of dynamic memory can be obtained by reading the `__heap_base` global. Memory managers for example do this to decide where to place their bookkeeping structures before partitioning the heap. [WebAssembly is specified to use little-endian](https://webassembly.github.io/spec/core/syntax/instructions.html#memory-instructions) and as a result, so is AssemblyScript.

The memory manager guarantees an alignment of 16 bytes, so an `ArrayBuffer`, which can be the backing buffer of multiple views, always fits up to `v128` values with native alignment.

Objects in AssemblyScript have a common hidden header used by the runtime to keep track of them. The header includes information about the block used by the memory manager, state information used by the garbage collector, a unique id per concrete class and the data's actual size. The length of a `String` \(id = 1\) is computed from that size for example. The header is "hidden" in that the reference to an object points right after it, at the first byte of the object's actual data.

<img src="images/managedobjectlayout.svg" alt="Managed Object Layout" />

#### Common header layout

| Name    | Offset | Type  | Description
| :------ | -----: | :---- | :----------
| #mmInfo |    -16 | usize | General block information
| #gcInfo |    -12 | usize | Reference count etc.
| #rtId   |     -8 | u32   | Unique id of the concrete class
| #rtSize |     -4 | u32   | Size of the data following the header

The most basic objects using the common header are `ArrayBuffer` and `String`. These do not have any fields but are just data:

#### ArrayBuffer layout

| Name  | Offset | Type          | Description
| :---- | -----: | :------------ | :----------
|       |    -16 | See above     | Common header
| \[0\] |      0 | 8-bit untyped | The first byte
| \[1\] |      1 | 8-bit untyped | The second byte
| ...   |        |               |
| \[N\] |      N | 8-bit untyped | The N-th byte

#### String layout

| Name  | Offset | Type      | Description
| :---- | -----: | :-------- | :----------
|       |    -16 | See above | Common header
| \[0\] |      0 | u16       | The first character
| \[1\] |      2 | u16       | The second character
| ...   |        |           |
| \[N\] | N << 1 | u16       | The N-th character

Unlike other languages, strings in AssemblyScript use UTF-16 encoding to match common JavaScript APIs in an attempt to avoid re-encoding on every JS-API call. While this helps to reduce the overhead when talking to the host, it can introduce some overhead when integrating AssemblyScript into a C environment where using UTF-16 is not an option \([see also](./stdlib/string.md#utf-16-vs-utf-8)\).

Collections like `Array`, `Map` and `Set` use one or multiple `ArrayBuffer`s to store their data, but the backing buffer is exposed by the typed array views only because other collections can grow automatically, which would otherwise lead to no longer valid references sticking around.

#### ArrayBufferView layout

This is not an actual class but a helper to simplify the implementation of the typed array views. Each typed array view like `Uint8Array` is like a subclass of `ArrayBufferView` with a static value type attached.

| Name        | Offset | Type        | Description
| :---------- | -----: | :---------- | :----------
|             |    -16 | See above   | Common header
| #data       |      0 | ArrayBuffer | Backing buffer reference
| #dataStart  |      4 | usize       | Start of the data within .data
| #dataLength |      8 | u32         | Length of the data from .dataStart

#### Array layout

| Name    | Offset | Type      | Description
| :------ | -----: | :-------- | :----------
|         |    -16 | See above | Common header
|         |      0 | See above | ArrayBufferView
| .length |     12 | i32       | Mutable length of the data the user is interested in

The layouts of `Set` and `Map` are a bit more sophisticated and therefore not mentioned here, but feel free to take a look at their sources.

#### Notes

One obvious shortcoming of this layout alone is that accessing the values of an array must go through one level of indirection. For example, an `arr[i]` must first obtain a reference to the backing buffer and only then is able to read the actual value. One possible way to solve this is to make use of the [Multi-value proposal for WebAssembly](https://github.com/WebAssembly/multi-value) eventually, lowering typed arrays for example to multiple values that are passed around directly, so the reference to the backing buffer is already on the execution stack. Another is to provide more knowledge about specific structures to Binaryen, so it can cache the reference to the backing buffer as long as the array does not grow, but it is unclear how feasible this is.

A more general issue is that AssemblyScript is essentially a compiler on top of another compiler \(here. Binaryen\), with Binaryen already providing all the utility to do optimizations that we do not want to duplicate. Thus, it is still to decide how to get rid of unnecessary range checks for example. For now, there is the famous `unchecked(expression)` built-in that explicitly request no bounds checks on indexed access, but this certainly isn't forever.
