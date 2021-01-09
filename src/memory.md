---
description: How to import and export memory, and all the details on its layout.
---

# Memory

Similar to other languages that use linear memory, and until the [GC](https://github.com/WebAssembly/gc) 🦄 proposal becomes available, all data in AssemblyScript is stored at a specific offset in linear memory so other parts of the program can read and modify it.

## Importing memory

The [WebAssembly.Memory](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/Memory) instance used by your program can be imported from the host by using the `--importMemory` command line options. The module will then expect an import named `memory` within the `env` module to be provided upon instantiation.

An imported memory becomes the singleton memory of the module and can be accessed in the same way as a non-imported memory. Note that if the module defines `data` segments, it will place the data into the imported memory upon instantiation of the module, which must be taken into account when pre-populating the memory externally \(i.e., utilize`--memoryBase` to reserve some space as described in [Memory Regions](./memory.md#memory-regions) below\).

## Exporting memory

A module exports its memory as `memory` by default, unless disabled with `--noExportMemory`.

## Accessing memory during instantiation

AssemblyScript runs any top-level statements as part of the emitted WebAssembly module's implicit `start` function by default. Since the implicit start functions executes immediately upon instantiation, this leads to a special case because control flow has not yet yielded back to the host, so the module's exported memory only becomes available externally *after* the implicit start function completes. The implicit start function may however already trigger external code that requires to read from memory, like when printing a string to console.

There are two solutions to this:

1. **Exporting an explicit start function**

   The `--explicitStart` command line argument can be used to force exporting the start function as `_start` instead of making it the module's implicit start function. When doing so it is important to call `exports._start()` once before calling any other exports to properly initialize the module first.

2. **Preparing memory pre-instantiation and importing it**

   An alternative is to create the `WebAssembly.Memory` object before instantiating the module, and using `--importMemory` to import it. This way around the memory is already known when the implicit start function executes.

## Memory regions

Internally, there are two regions of memory the compiler is aware of:

### Static memory

Memory starts with static data, like strings and arrays \(of constant values\) the compiler encountered while translating the program. Unlike in other languages, there is no concept of a stack in AssemblyScript and it instead relies on WebAssembly's execution stack exclusively.

A custom region of memory can be reserved using the `--memoryBase` option. For example, if one needs an image buffer of exactly N bytes, instead of allocating it one could reserve that space, telling the compiler to place its own static data afterwards, partitioning memory in this order:

| Region          | Description
| :-------------- | :----------
| Reserved memory | As specified with `--memoryBase`
| Static memory   | Starting right after reserved memory, ends at `__heap_base`
| Dynamic memory  | Starting right after static memory, starts at `__heap_base`

### Dynamic memory

Dynamic memory, commonly known as the heap, is managed by the [garbage collector](./garbage-collection.md), at runtime. When space for a new object is requested by the program, the runtime's memory manager reserves a suitable region and returns a pointer to it to the program. Once an object is not needed anymore and becomes unreachable, the garbage collector returns the object's memory to the memory manager for reuse.

The memory manager guarantees an alignment of 16 bytes, so an `ArrayBuffer`, which can be the backing buffer of multiple views, always fits up to `v128` values with native alignment.

## Internals

[WebAssembly is specified to use little-endian](https://webassembly.github.io/spec/core/syntax/instructions.html#memory-instructions) and as a result, so is AssemblyScript.

Objects in AssemblyScript have a common hidden header used by the runtime to keep track of them. The header includes information about the block used by the memory manager, state information used by the garbage collector, a unique id per concrete class and the data's actual size. The length of a `String` \(id = 1\) is computed from that size for example. The header is "hidden" in that the reference to an object points right after it, at the first byte of the object's actual data.

<img src="images/managedobjectlayout.svg" alt="Managed Object Layout" />

#### Common header layout

| Name     | Offset | Type  | Description
| :------- | -----: | :---- | :----------
| #mmInfo  |    -20 | usize | Memory manager info
| #gcInfo  |    -16 | usize | Garbage collector info
| #gcInfo2 |    -12 | usize | Garbage collector info
| #rtId    |     -8 | u32   | Unique id of the concrete class
| #rtSize  |     -4 | u32   | Size of the data following the header
|          |      0 |       | Payload starts here

The header is aligned to 16 bytes right after `mmInfo` and `rtSize`, with 16 bytes of managed information in between. The object's payload starts at 16 bytes alignment again.

The most basic objects using the common header are `ArrayBuffer` and `String`. These do not have any fields but are just data:

#### ArrayBuffer layout

| Name  | Offset | Type          | Description
| :---- | -----: | :------------ | :----------
|       |    -20 | See above     | Common header
| \[0\] |      0 | 8-bit untyped | The first byte
| \[1\] |      1 | 8-bit untyped | The second byte
| ...   |        |               |
| \[N\] |      N | 8-bit untyped | The N-th byte

#### String layout

| Name  | Offset | Type      | Description
| :---- | -----: | :-------- | :----------
|       |    -20 | See above | Common header
| \[0\] |      0 | u16       | The first character
| \[1\] |      2 | u16       | The second character
| ...   |        |           |
| \[N\] | N << 1 | u16       | The N-th character

### Collections

Collections like `Array`, `Map` and `Set` use one or multiple `ArrayBuffer`s to store their data, but their backing buffers are only exposed for typed arrays, as it is the case in JavaScript. This is because collections can grow automatically, which would otherwise lead to no longer valid references to buffers pre-resize sticking around.

#### ArrayBufferView layout

This is not an actual class but a helper to simplify the implementation of the typed array views. Each typed array view like `Uint8Array` is like a subclass of `ArrayBufferView` with a static value type attached.

| Name        | Offset | Type        | Description
| :---------- | -----: | :---------- | :----------
|             |    -20 | See above   | Common header
| #data       |      0 | ArrayBuffer | Backing buffer reference
| #dataStart  |      4 | usize       | Start of the data within .data
| #dataLength |      8 | u32         | Length of the data from .dataStart

#### Array layout

| Name    | Offset | Type      | Description
| :------ | -----: | :-------- | :----------
|         |    -20 | See above | Common header
|         |      0 | See above | ArrayBufferView
| .length |     12 | i32       | Mutable length of the data the user is interested in

The layouts of `Set` and `Map` are a bit more sophisticated and therefore not mentioned here, but feel free to take a look at their sources.
