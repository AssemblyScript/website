---
description: 'How one source, multiple targets, fits into multiple sources, one target.'
---

# Portability

With AssemblyScript using a stricter variant of TypeScript's syntax with a few semantic differences, there comes the opportunity to compile the same code to JavaScript with `tsc` and WebAssembly with `asc`. The AssemblyScript compiler itself is portable code.

## Portable Stdlib

Besides the full standard library, AssemblyScript provides a portable variant of the functionality that is present in both JavaScript and WebAssembly. In addition to that, the portable library lifts some of the functionality that is only available with `asc` to JavaScript, like the portable conversions mentioned below.

To use the portable library, add the following somewhere along your build step so the portable features are present in the environment

```js
require("assemblyscript/std/portable")
```

and extend `assemblyscript/std/portable.json` instead of `assemblyscript/std/assembly.json` within your `tsconfig.json`. The AssemblyScript compiler itself is an example of how this can be done.

::: tip
The portable standard library is still pretty much a work in progress and we are extending it as we go while working on the compiler. If you need something specific, feel free to improve [its definitions and feature set](https://github.com/AssemblyScript/assemblyscript/tree/master/std/portable).
:::

## Differences

There are a few semantics differences that must be taken care of.

### Conversions

While `asc` understands the meaning of

```ts
// non-portable
let someFloat: f32 = 1.5
let someInt: i32 = <i32>someFloat
```

and then inserts the correct conversion steps, `tsc` does not because all numeric types are just aliases of `number`. Hence, when targeting JavaScript with `tsc`, the above will result in

```js
var someFloat = 1.5
var someInt = someFloat
```

which is obviously wrong. To account for this, portable conversions can be used, resulting in actually portable code. For example

```ts
// portable
let someFloat: f32 = 1.5
let someInt: i32 = i32(someFloat)
```

will essentially result in

```js
var someFloat = 1.5
var someInt = someFloat | 0
```

which is correct. The best way of dealing with this is asking yourself the question: What would this code do when compiled to JavaScript?

### Overflows

Likewise, again because `asc` knows the meaning but `tsc` does not, overflows must be handled explicitly:

```ts
// non-portable
let someU8: u8 = 255
let someOtherU8: u8 = someU8 + 1
```

```ts
// portable
let someU8: u8 = 255
let someOtherU8: u8 = u8(someU8 + 1)
```

essentially resulting in

```js
let someU8 = 255
let someOtherU8 = (someU8 + 1) & 0xff
```

### API features

In JavaScript, some parts of the standard library function a little more loosely than how they would when compiling to WebAssembly. While the portable definitions try to take care of this, one example where this can happen is `Map#get` returning `undefined` when a key cannot be found in JavaScript, while resulting in an abort in WebAssembly, where it is necessary to first check that the key exists using `Map#has`. The best way of dealing with this is asking yourself the question: What would this code do when compiled to WebAssembly?

## Limitations

In JavaScript, all numeric values are IEEE754 doubles that cannot represent the full range of values fitting in a 64-bit integer \([max. safe integer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_SAFE_INTEGER) is `2^53 - 1`\). Hence `i64` and `u64` are not portable and not present in `std/portable`. There are several ways to deal with this. One is to use an i64 polyfill like [in this example](https://github.com/AssemblyScript/examples/tree/master/i64).

Other than that, portable code \(JavaScript\) does not have a concept of memory, so there are no `load` and `store` implementations. Technically this can be polyfilled in various ways, but no default is provided since actual implementations are expected to be relatively specific \(for instance: the portable compiler accesses Binaryen's memory\).
