---
description: Because nobody enjoys being bullied by malloc, free and friends.
---

# Runtime

AssemblyScript's runtime takes care of all the ins and outs of memory management and garbage collection, yet the compiler lets a developer choose the ideal runtime variant for their use case.

## Variants

| Variant | Description
| :------ | :----------
| full    | A proper memory manager and reference-counting based garbage collector, with runtime interfaces being exported to the host for being able to create managed objects externally.
| half    | The same as `full` but without any exports, i.e. where creating objects externally is not required. This allows the optimizer to eliminate parts of the runtime that are not needed.
| stub    | A minimalist arena memory manager without any means of freeing up memory again, but the same external interface as `full`. Useful for very short-lived programs or programs with hardly any memory footprint, while keeping the option to switch to `full` without any further changes. No garbage collection.
| none    | The same as `stub` but without any exports, for the same reasons as explained in `half`. Essentially evaporates entirely after optimizations.

The default runtime included in a program is the `full` runtime, but deciding for another variant using the `--runtime` option can help to reduce binary size significantly. The `full` runtime adds about 2KB of additional optimized code to your module, which is not that much considering what it brings to the table, but might still be overkill for simple programs.

::: tip
Previous versions of the compiler \(pre 0.7\) did not include any runtime functionality by default but instead required `import`ing an allocator and potentially an experimental tracing collector. This is not supported anymore by recent versions of the compiler.
:::

## Interface

The following paragraphs are relevant in low-level code respectively when working with objects externally only. In normal high-level code, the compiler utilizes these mechanisms automatically.

### Allocating managed objects

When allocating a managed object, it is necessary to also provide its unique class id so the runtime can properly recognize it. The unique id of any managed type can be obtained via `idof<TheType>()`. Each concrete class \(like `String`, `Array<i32>`, `Array<f32>`\) has its own id. The ids of ArrayBuffer \(id=0\), String \(id=1\) and ArrayBufferView \(id=2\) are always the same, while all other ids are generated sequentially on first use of a class and differ between modules. Hence, it is usually necessary to `export Uint8Array_ID = idof<Uint8Array>()` for example when allocating one externally. The relevant interface is:

* ```ts
  function __alloc(size: usize, id: u32): usize
  ```
  Dynamically allocates a chunk of memory for an object represented by the specified id of at least the given size in bytes and returns its address. Alignment is guaranteed to be 16 bytes to fit up to v128 values naturally. Does not zero memory.

The [loader](../basics/loader.md) provides some additional functionality for convenience, like `__allocString`.

### Managing lifetimes

The concept is simple: If a reference to an object is established, the reference count of the object is increased by 1 \(a reference is retained\), and when a reference to an object is deleted, the reference count of the object is decreased by 1 \(a reference is released\). If the reference count of an object reaches 0, it is considered for collection and its memory ultimately returned to the memory manager for reuse. The relevant interface is:

* ```ts
  function __retain(ptr: usize): usize
  ```
  Retains a reference to the object pointed to by `ptr`. The object doesn't become collected as long as there's at least one retained reference to it. Returns the pointer.

* ```ts
  function __release(ptr: usize): void
  ```
  Releases a reference to the object pointer to by `ptr`. The object is considered for collection once all references to it have been released.

The compiler inserts retain and release calls automatically and this is opaque to a user on a higher level. On a lower level, for instance when dealing with managed objects externally, it is necessary to understand and adhere to the rules the compiler applies.

{% hint style="info" %}
Technically, both `__retain` and `__release` are nops when using the `stub`runtime, so one can either decide to skip the following for good or spend a little extra time to account for the possibility of upgrading to `full` later on.
{% endhint %}

#### Rules

1. A reference to an object **is retained** when assigning it to a target \(local, global, field or otherwise inserting it into a structure\) of a reference type, with the exceptions stated in \(3\).
2. A reference to an object **is released** when assigning another object to a target of a reference type previously retaining a reference to it, or if the lifetime of the local or structure currently retaining a reference to an object ends.
3. A reference to an object **is not released** but **remains retained** when returning a reference typed object from a call \(function, getter, constructor or operator overload\). Instead, the caller is expected to perform the release. This also means: 
   * If a reference to the object **would be immediately retained** by assigning the object to a target of a reference type, the compiler will not retain it twice, but skip retaining it on assignment.
   * If a reference to the object **will not be immediately retained**, the compiler will insert a temporary local into the current scope that autoreleases the reference to the object at the end of the scope.

::: tip
Objects created by calling `__alloc` start with a reference count of 0. This is not the case for constructors, these behave like calls. Built-ins like `store<T>` emit instructions directly and don't behave like calls.
:::

### Working with references externally

Working with objects through imports and exports, like when using [the loader](./loader.md), is _relatively_ straight-forward. However, if not handled properly, the program will either leak memory, free objects prematurely or even break. So here's some advice:

* Always `__retain` a reference to manually `__alloc`'ed objects and `__release` the reference again when done with the object.
* Always `__release` the reference to an object that was a return value of a call \(see above\) when done with it. It is not necessary to `__retain` a reference to returned objects.
* Always `__retain` a reference to an object read from memory, and `__release` the reference again when done with the object.

### Working with references internally

Working with objects internally, like when creating custom standard library components or otherwise writing low-level code, requires special care because switching between pointers and reference types can become quite tricky. The internal interface also provides [additional utility](https://github.com/AssemblyScript/assemblyscript/tree/master/std/assembly/rt) that is only relevant in very specific cases.

::: tip
One common point of confusion here is that the rules above **operate on types, not values**. Means: If the target is of a reference-type, the rules apply, but if the target is of an `usize` type, the rules do not apply, even if the value is a `changetype<usize>(..)`'d object.
:::

```ts
{
  let ref = new ArrayBuffer(10) // retains (reference type)
  let buf = changetype<usize>(ref) // does not retain (usize)
  ...
  // compiler will automatically __release(ref)
}
```

```ts
{
  let buf = changetype<usize>(new ArrayBuffer(10)) // does not retain (usize)
  // inserts a temporary, because _the object_ is not immediately assigned
  ...
  // compiler will automatically __release(theTemp)
}
```

```ts
{
  let ref = changetype<ArrayBuffer>(__alloc(10, idof<ArrayBuffer>())
  // retains on ref, because after changetype an object is assigned
  ...
  // compiler will automatically __release(ref)
}
```

### Collecting garbage

By default, the full and half runtime will automatically try to collect cyclic garbage when memory must be grown. This behavior can be disabled by setting `gc.auto = false` in performance critical code. Likewise, if there is a good opportunity to collect cyclic garbage at a given point in time, like if the application is idle, `gc.collect()` can be called to force a full garbage collection cycle. Protip: If no cyclic structures are used, no garbage must be collected.

## Future options

The reason for implementing our own runtime is that [WebAssembly GC](https://github.com/WebAssembly/gc) is still in the works without any ETA on it, unfortunately. So we decided to roll our own for the time being, but as soon as WebAssembly GC lands, it is likely that we are going to reconsider alternatives.

## Implementation

The memory manager used by AssemblyScript is a variant of TLSF \([Two-Level Segregate Fit memory allocator](http://www.gii.upv.es/tlsf/)\) and it is accompanied by PureRC \(a variant of [A Pure Reference Counting Garbage Collector](https://researcher.watson.ibm.com/researcher/files/us-bacon/Bacon03Pure.pdf)\) with [slight modifications of assumptions](https://github.com/dcodeIO/purerc) to avoid unnecessary work. Essentially, TLSF is responsible for partitioning [dynamic memory](./memory.md#dynamic-memory) into chunks that can be used by the various objects, while PureRC keeps track of their lifetimes.

## Performance considerations

Both the TLSF memory manager and the concept of reference counting are a good fit for _predictable performance_ scenarios. Remember: WebAssembly is about exactly that. It is not necessarily the fastest choice in every possible scenario, though.

It is also likely that our implementations are not as optimized yet as ultimately possible. If you are smarter than us, please let us know of your thoughts and findings.

## Internals

If you are interested in the inner workings, the internal APIs are explained in [the runtime's README file](https://github.com/AssemblyScript/assemblyscript/tree/master/std/assembly/rt) and of course in its sources - feel free to take a look!

#### Runtime type information \(RTTI\)

Every module using managed objects contains a memory segment with basic type information, that [the loader](./loader.md) for example uses when allocating new arrays. Internally, RTTI is used to perform dynamic `instanceof` checks and to determine whether a class is inherently acyclic. The memory offset of RTTI can be obtained by reading the `__rtti_base` global. Essentially, the compiler maps every concrete class to a unique id, starting with 0 \(=ArrayBuffer\), 1 \(=String\) and 2 \(=ArrayBufferView\) . For each such class, the compiler remembers the id of the respective base class, if any, and a set of flags describing the class. Flags for example contain information about key and value alignments, whether a class is managed and so on. Structure is like this:

| Name        | Offset | Type | Description
| :---------- | -----: | :--- | :----------
| #count      |      0 | u32  | Number of concrete classes
| #flags\[0\] |      4 | u32  | Flags describing the class with id=0
| #base\[0\]  |      8 | u32  | Base class id of the class with id=0
| #flags\[1\] |     12 | u32  | ... etc. ...

Flag values are currently still in flux, but if you are interested in these, feel free to take a look at the sources.

#### Notes

Unlike other reference counting implementions, allocating an object starts with a reference count of 0. This is useful in standard library code where memory is first allocated and then assigned to a variable, establishing the first reference.

The compiler does some extra work to evaluate whether an object can potentially become part of a reference cycle. Any object that cannot directly or indirectly reference another object of its kind is considered _inherently acyclic_, so it does not have to be added to the cycle buffer for further evaluation by deferred garbage collection.

Due to the lack of random access to WebAssembly's execution stack \(remember: AssemblyScript does not have a stack on its own\), values returned from a function become pre-retained for the caller, expecting that it will release the reference at the end, or give the reference to its own caller. This also leads to situations where sometimes a reference must be retained on assignment, and sometimes it must not. It also leads to situations where two branches must be unified, for example if there is a pre-retained value in one arm and one that is not in the other. The compiler is taking care of these situations, but it also requires special care when dealing with the reference counting internals within the standard library.

The compiler also utilizes a concept of so called autorelease locals. Essentially, if a reference enters a block of code from somewhere else, is pre-retained but not immediately assigned, such a local is added to the current scope to postpone the necessary release until the scope is exited.

One thing not particularly ideal at this point is that each function is expected to retain the reference-type arguments it is given, and release them again at the end. This is necessary because the compiler does just a single pass and doesn't know whether a variable becomes reassigned beforehand \(no SSA or similar, that's left to Binaryen in an attempt to avoid duplicating its code\). It does already skip this for certain variables like `this` that cannot be reassigned, but there are definitely more optimization opportunities along the way. Due to AssemblyScript essentially being a compiler on top of another compiler, it is somewhat unclear however where to perform such optimizations.
