---
description: Direct access to the memory manager.
---

# heap

An unsafe interface to use the dynamic memory manager directly, resembling `malloc`, `realloc` and `free`. Manual memory management can be used in parallel to garbage collection, which can be quite handy, but manually managed blocks cannot be mixed with garbage collected objects (i.e. trying to `heap.free` a GC object or casting a block to a managed object respectively would break since one has a GC header and the other does not).

## Static members

* ```ts
  function heap.alloc(size: usize): usize
  ```
  Allocates a chunk of memory of at least the specified size.

* ```ts
  function heap.realloc(ptr: usize, size: usize): usize
  ```
  Reallocates a chunk of memory to have at least the specified size.

* ```ts
  function heap.free(ptr: usize): void
  ```
  Frees a chunk of memory.

* ```ts
  function heap.reset(): void
  ```
  Dangerously resets the entire heap. Specific to the "stub" runtime.
