---
description: A fixed-length sequence of UTF-16 code units.
---

# String

A fixed-length sequence of UTF-16 code units.

The String API works very much like JavaScript's \([MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)\), with the notable difference that the `string` type is an actual alias of `String`.

## Static members

* ```ts
  function fromCharCode(unit: i32, surr?: i32): string
  ```
  Creates a one character long string from the specified UTF-16 code units.

* ```ts
  function fromCharCodes(units: u16[]): string
  ```
  Creates a string from a sequence of UTF-16 code units.

* ```ts
  function fromCodePoint(code: i32): string
  ```
  Creates a one character long string from the specified Unicode code point.

* ```ts
  function fromCodePoints(codes: i32[]): string
  ```
  Creates a string from a sequence of Unicode code points.

## Instance members

### Fields

* ```ts
  readonly length: i32
  ```
  The length of the string in UTF-16 code units.

### Methods

* ```ts
  function at(pos: i32): string
  ```
  Gets the UTF-16 code unit at the specified position as a single character string. This method allows for positive and negative integers. Negative integers count back from the last string character.
* ```ts
  function charAt(pos: i32): string
  ```
  Gets the UTF-16 code unit at the specified position as a single character string. Returns `""` \(empty string\) if out of bounds.

* ```ts
  function charCodeAt(pos: i32): i32
  ```
  Gets the UTF-16 code unit at the specified position as a number. Returns `-1` if out of bounds.

* ```ts
  function codePointAt(pos: i32): i32
  ```
  Gets the Unicode code point at the specified \(UTF-16 code unit\) position as a number, possibly combining multiple successive UTF-16 code units. Returns `-1` if out of bounds.

* ```ts
  function concat(other: string): string
  ```
  Concatenates this string with another string, in this order, and returns the resulting string.

* ```ts
  function endsWith(search: string, end?: i32): bool
  ```
  Tests if the strings ends with the specified string. If specified, `end` indicates the position at which to stop searching, acting as if it is the length of the string.

* ```ts
  function includes(search: string, start?: i32): bool
  ```
  Tests if the string includes the search string. If specified, `start` indicates the position at which to begin searching.

* ```ts
  function indexOf(search: string, start?: i32): i32
  ```
  Gets the first index of the specified search string within the string, or `-1` if not found. If specified, `start` indicates the position at which to begin searching.

* ```ts
  function lastIndexOf(search: string, start?: i32): i32
  ```
  Gets the last index of the specified search string within the string, or `-1` if not found. If specified, `start` indicates the position at which to begin searching from right to left.

* ```ts
  function padStart(length: i32, pad: string): string
  ```
  Pads the string with the contents of another string, possibly multiple times, until the resulting string reaches the specified length, returning the resulting string.

* ```ts
  function padEnd(length: i32, pad: string): string
  ```
  Pads the string with the contents of another string, possibly multiple times, until the resulting string reaches the specified length, returning the resulting string.

* ```ts
  function repeat(count?: i32): string
  ```
  Repeats the string `count` times and returns the concatenated result.

* ```ts
  function replace(search: string, replacement: string): string
  ```
  Replaces the first occurrence of `search` with `replacement`.

* ```ts
  function replaceAll(search: string, replacement: string): string
  ```
  Replaces all occurrences of `search` with `replacement`.

* ```ts
  function slice(start: i32, end?: i32): string
  ```
  Returns the region of the string from `start` inclusive to `end` exclusive, as a new string. If omitted, `end` defaults to the end of the string.

* ```ts
  function split(separator?: string, limit?: i32): string[]
  ```
  Splits the string at each occurrence  of `separator` and returns the result as a new array of strings that has a maximum of `limit` values. If `limit` is omitted, no limit is assumed. If `separator` is omitted or not present in the string, the string becomes the sole element of the array. If `separator` is an empty string, the split is performed between code units \(not code points\), potentially destroying surrogate pairs.

* ```ts
  function startsWith(search: string, start?: i32): bool
  ```
  Tests if the string starts with the specified string. If specified, `start` indicates the position at which to begin searching, acting as the start of the string.

* ```ts
  function substring(start: i32, end?: i32): string
  ```
  Gets the part of the string in between `start` inclusive and `end` exclusive as a new string.

* ```ts
  function toString(): this
  ```
  Returns the string.

* ```ts
  function trim(): string
  ```
  Removes white space characters from both the start and the end of the string, returning the resulting string.

* ```ts
  function trimStart(): string
  function trimLeft(): string
  ```
  Removes white space characters from the start of the string, returning the resulting string.

* ```ts
  function trimEnd(): string
  function trimRight(): string
  ```
  Removes white space characters from the end of the string, returning the resulting string.

## Encoding API

### UTF8

When integrating with an environment that uses UTF-8, the following helpers can be used to quickly re-encode String data.

* ```ts
  function String.UTF8.byteLength(str: string, nullTerminated?: bool): i32
  ```
  Calculates the byte length of the specified string when encoded as UTF-8, optionally null terminated.

* ```ts
  function String.UTF8.encode(str: string, nullTerminated?: bool): ArrayBuffer
  ```
  Encodes the specified string to UTF-8 bytes, optionally null terminated.

* ```ts
  function String.UTF8.encodeUnsafe(str: usize, len: i32, buf: usize, nullTerminated?: bool): usize
  ```
  Encodes the specified raw string to UTF-8 bytes, opionally null terminated. Returns the number of bytes written.

* ```ts
  function String.UTF8.decode(buf: ArrayBuffer, nullTerminated?: bool): string
  ```
  Decodes the specified buffer from UTF-8 bytes to a string, optionally null terminated.

* ```ts
  function String.UTF8.decodeUnsafe(
    buf: usize,
    len: usize,
    nullTerminated?: bool
  ): string
  ```
  Decodes raw UTF-8 bytes to a string, optionally null terminated.

::: tip
Note that any `ArrayBuffer` return value is a pointer to the buffer's data internally and thus can be passed to let's say a C-function directly. However, if the pointer is meant to live longer than the immediate external function call, the [lifetime of the buffer must be tracked](../runtime.md#managing-lifetimes) so it doesn't become collected prematurely with the data becoming invalid.
:::

### UTF16

The following mostly exist to have a safe way to copy between Strings and ArrayBuffers, but doesn't involve a re-encoding step.

* ```ts
  function String.UTF16.byteLength(str: string): i32
  ```
  Calculates the byte length of the specified string when encoded as UTF-16.

* ```ts
  function String.UTF16.encode(str: string): ArrayBuffer
  ```
  Encodes the specified string to UTF-16 bytes.

* ```ts
  function String.UTF16.encodeUnsafe(str: usize, len: i32, buf: usize): usize
  ```
  Encodes the specified raw string to UTF-16 bytes. Returns the number of bytes written.

* ```ts
  function String.UTF16.decode(buf: ArrayBuffer): string
  ```
  Decodes the specified buffer from UTF-16 bytes to a string.

* ```ts
  function String.UTF16.decodeUnsafe(buf: usize, len: usize): string
  ```
  Decodes raw UTF-16 bytes to a string.

## Considerations

AssemblyScript strings purposely share their semantics with JavaScript strings, including that isolated surrogates can occur and are not eagerly sanitized. This is done for two reasons. First, as the [Unicode Standard, Version 13.0](https://www.unicode.org/versions/Unicode13.0.0/ch02.pdf) states in **§2.7 Unicode Strings**:

> Depending on the programming environment, a Unicode string may or may not be required to be in the corresponding Unicode encoding form. For example, strings in Java, C#, or ECMAScript are Unicode 16-bit strings, but are not necessarily well-formed UTF-16 sequences. In normal processing, it can be far more efficient to allow such strings to contain code unit sequences that are not well-formed UTF-16—that is, isolated surrogates. Because strings are such a fundamental component of every program, checking for isolated surrogates in every operation that modifies strings can create significant overhead, especially because supplementary characters are extremely rare as a percentage of overall text in programs worldwide.

Second, sanitization is also not desirable in between AssemblyScript and JavaScript, or between two AssemblyScript modules, where it can be critical to maintain equality, inequality and hash integrity of idiomatic strings when function calls traverse JS\<->AS or AS\<->AS boundaries. It is common, for example, that an application is composed of both AssemblyScript and JavaScript code, or that an AssemblyScript module replaces a JavaScript module, and it is expected that two AssemblyScript modules can exchange strings, where sanitizing (mutating) strings eagerly would be unnecessary and dangerous. Also, ESM-integration aims to make JavaScript and WebAssembly modules interchangeable more broadly, which can only be achieved safely when maintaining compatibility.

Note that this stance differs from what the majority within the WebAssembly CG [has decided](https://github.com/WebAssembly/meetings/blob/main/main/2021/CG-08-03.md) for Interface Types and the Component Model, including its Web integration, regardless of our concerns ([1](https://github.com/WebAssembly/design/issues/1419), [2](https://github.com/WebAssembly/interface-types/issues/135#issuecomment-890743678)), yet we believe that sanitization should only be performed where unavoidable, ideally as late as possible, matching what Web APIs do today (say right when calling an HTTP API but no earlier) to not impose unresolvable problems on the many popular languages already matching what JavaScript and the Web do. As such, we'd prefer if Interface Types and similar or related proposals revised their approach to follow WebIDL's precedent, where [`DOMString`](https://webidl.spec.whatwg.org/#idl-DOMString) represents the concept and [`USVString`](https://webidl.spec.whatwg.org/#idl-USVString) is the special case. As WebIDL states:

> When in doubt, use `DOMString`.

Of course we agree that `USVString` should be supported in some capacity to match what Rust and C++ do, but making it the only supported concept will not only break the other half of the ecosystem on a fundamental level, but also the Web platform as a whole, which is unnecessary and avoidable given that sanitization can easily be performed by an interface adapter *only when needed*.
