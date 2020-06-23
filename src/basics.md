---
description: There is something appealing to it, isn't it?
---

# Basics

WebAssembly is fundamentally different from JavaScript, ultimately enabling entirely new use cases not only on the web. Consequently, AssemblyScript is much more similar to a static compiler than it is to a JavaScript VM. One can think of it as if TypeScript and C had a somewhat special child. This page is dedicated to get you up to speed in no time.

## Strictness

Unlike TypeScript, which targets a JavaScript environment with all of its dynamic features, AssemblyScript targets WebAssembly with all of its static guarantees, hence intentionally **avoids the dynamicness of JavaScript** where it cannot be compiled ahead of time _efficiently_.

Limiting ourselves to where WebAssembly excels, for example by assigning or inferring definite types, eliminates the need to ship a JIT doing the heavy lifting at runtime, yielding **predictable performance** right from the start of execution while guaranteeing that the resulting WebAssembly **modules are small**.

## Static typing

The first peculiarity one is going to notice when writing AssemblyScript is that its [basic types](./types.md) are a bit different from TypeScript's in that it uses WebAssembly's **more specific integer and floating point types**, with JavaScript's `number` merely an alias of WebAssembly's `f64`.

A JavaScript JIT would try to figure out the best representation of a numeric value while the code is executing, making assumptions as values flow around, potentially recompiling code multiple times, while AssemblyScript lets the developer **specify the ideal type in advance** with all its pros and cons. To give a few examples:

### No any or undefined

```ts
// 😢
function foo(a?) {
  var b = a + 1
  return b
}

// 😊
function foo(a: i32 = 0): i32 {
  var b = a + 1
  return b
}
```

### No union types

```ts
// 😢
function foo(a: i32 | string): void {
}

// 😊
function foo<T>(a: T): void {
}
```

### Strictly typed objects

```ts
// 😢
var a = {}
a.prop = "hello world"

// 😊
var a = new Map<string,string>()
a.set("prop", "hello world")

// 😊
class A {
  constructor(public prop: string) {}
}
var a = new A("hello world")
```

## Sandbox

WebAssembly modules execute in a sandbox, providing **strong security guarantees** for all sorts of use cases not necessarily limited to the browser. As such, a module has **no immediate access to the DOM** or other external APIs out of the box, making it necessary to translate and exchange data either through the module's [exports and imports](./exports-and-imports.md) or reading from respectively writing to the module's linear memory.

## Low-level

Currently, values WebAssembly can exchange out of the box are **limited to basic numeric values**, and one can think of objects as a clever composition of basic values stored in linear memory. As such, whole **objects cannot yet flow in and out of WebAssembly** natively, making it necessary to translate between their representations in WebAssembly memory and JavaScript objects. This is typically the first real bummer one is going to run into.

For now, there is [the loader](./loader.md) that provides the utility necessary to exchange strings and arrays for example, but it is somewhat edgy on its own due to its garbage collection primitives. It's a great starting point however for learning more about how the higher level structures _actually_ work.

In the near to distant future, the [reference types](https://github.com/WebAssembly/reference-types) 🦄, [interface types](https://github.com/WebAssembly/interface-types) 🦄 and ultimately [GC](https://github.com/WebAssembly/gc) 🦄 proposals will make much of this a lot easier.

## Quirks

Some patterns behave a little different in AssemblyScript compared to TypeScript, and a few features aren't yet feasible to implement on top of just the WebAssembly MVP. This section covers the more or less obvious ones and shows how to deal with them, so you can keep them in mind and build something great today. In fact, even the AssemblyScript compiler itself is subject to these.

### Triple equals

The special semantics of the `===` operator (`true` when both the value and type match) don't make a lot of sense in AssemblyScript because comparing two values of incompatible types is illegal anyway. Hence the `===` operator has been repurposed to perform an identity comparison, evaluating to `true` if both operands are **the exact same object**:

```ts
var a = "hello"
var b = a
var c = "h" + a.substring(1)

if (a === b) { /* true */ }
if (a === c) { /* false */ }
if (a == c) { /* true */ }
```

This semantical change turned out to be quite useful during implementation of some parts of the standard library where knowing if something is actually exactly the same makes a lot of sense, but it can be confusing for those coming from a TypeScript background where using `===` for everything unless required otherwise is common good practice. However, the alternative here is to make `===` a redundanat alias of `==` by sacrificing an otherwise useful feature, and it's still unclear if that'd be objectively better, so has been postponed multiple times.

### Nullability checks

Like TypeScript, the AssemblyScript compiler can propagate whether a value is nullable or not after a check:

```ts
function doSomething(something: string | null): void {
  if (something) {
    something.length // works
  }
}
```

This doesn't work on fields, however, because their value can change in between the check and the use of the value:

```ts
function doSomething(foo: Foo): void {
  if (foo.something) {
    // ... some code ...
    foo.something.length // fails
  }
}
```

For example, `foo.something` might be a property that sets the underlying field to `null` when accessed, or code in between may set the field to `null`. In fact, TypeScript [fails](https://www.typescriptlang.org/play/index.html#code/MYGwhgzhAEBiD29oG8BQ0PQvAtgUwBcALASwDsBzALiwICdyLoAfaMgVxBGgF43OQAblQBfVKgBm7MsAIl4ZaABN4AZVyFSlABQTENBPACUKdJhITouxADps+YoxNpMr5Wo2PKAURAQ81sbCbph68HaeWhQ2IHiUxILQAPRJWETwnErQeHR08HQANNAARuwE7ngQZADkBGYYYmKS0rLyiirqDlG+-oEGiM710GERXYy8-FzCIkA) in [both](https://www.typescriptlang.org/play/index.html#code/MYGwhgzhAEBiD29oG8BQ0PQPoXgWwFMAXACwEsA7AcwC5oIiAnSq6AH2goFcQRoBeaACISBXvCEBudJirF6+YuWoAKAJR0Gzau048+aTEegh5jeYNJkIAOhyKr1accxXb9wo9aDuvZy+hzIi5GCkDifwwAX1QY1AAzLgpgIjJ4MIATeABlB2UqFXjEOgR4NRQZDDJ46ELEG1xPfPLDAKL4BryWG1NqUkloAHpB+hJ4HgzoAkZGeEYAGmgAIy4iaCyCCAoAciJK6BiYoA) scenarios, leading to a runtime error. However, there can't be runtime errors like this in AssemblyScript, so one must instead use a local to be safe:

```ts
function doSomething(foo: Foo): void {
  let something = foo.something
  if (something) {
    something.length // works
  }
}
```

### Exceptions

Exceptions are not yet supported and we are waiting for the [Exception Handling](https://github.com/WebAssembly/exception-handling) 🦄 proposal to land. As a consequence, the following will currently crash the program with a call to `abort`:

```ts
function doThrow(): void {
  throw new Error("message")
}
```

In the meantime we recommend to do as they did in the olden days and return an error code or `null` to indicate an exception.

### Closures

Closures are not yet supported and we are waiting for the [Function References](https://github.com/WebAssembly/function-references) 🦄 proposal (`func.bind`?) to land. However, since this is a crucial language feature, work on a preliminary implementation not depending on future WebAssembly features [has started](https://github.com/AssemblyScript/assemblyscript/pull/1308), but the prototype is still in flux and currently limited to read only captures. You can try it out with `npm install assemblyscript-closures-beta`.

In the meantime we recommend to restructure code so closures are not necessary, i.e. instead of writing

```ts
function computeSum(arr: i32[]): i32 {
  var sum = 0
  arr.forEach(value => {
    sum += value // fails
  })
  return sum
}
```

restructure to

```ts
var sum: i32 // becomes a WebAssembly Global
function computeSum(arr: i32[]): i32 {
  sum = 0
  arr.forEach(value => {
    sum += value // works
  })
  return sum
}
```

or to

```ts
function computeSum(arr: i32[]): i32 {
  var sum = 0
  for (let i = 0, k = arr.length; i < k; ++i) {
    sum += arr[i] // works
  }
  return sum
}
```
