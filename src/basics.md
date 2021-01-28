---
description: There is something appealing to it, isn't it?
---

# Basics

WebAssembly is fundamentally different from JavaScript, ultimately enabling entirely new use cases not only on the web. Consequently, AssemblyScript is much more similar to a static compiler than it is to a JavaScript VM. One can think of it as a mix of TypeScript's high level syntax and C's low-level capabilities. This page is dedicated to getting you up to speed in no time.

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

WebAssembly modules execute in a sandbox, providing **strong security guarantees** for all sorts of use cases not necessarily limited to the browser. As such, a module has **no immediate access to the DOM** or other external APIs out of the box. Also, WebAssembly does not yet have a concept of objects, making it necessary to **translate and exchange objects via pointers** to linear memory either through the module's [exports and imports](./exports-and-imports.md) or by reading from respectively writing to the module's linear memory. The [loader](./loader.md) is able to help there.

## Quirks

Some patterns behave a little different in AssemblyScript compared to TypeScript. This section covers the more or less obvious ones and shows how to deal with them, so you can keep them in mind and build something great today.

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

### Non-linear compilation

AssemblyScript does not compile a module linearly, but starts at the module's exports and only compiles what's reachable from them, often referred to as [tree-shaking](https://en.wikipedia.org/wiki/Tree_shaking). As such, dead code is always validated syntactically, but not necessarily checked for semantic correctness. While this mechanism significantly helps to reduce compile times and feels almost natural to those familiar with *executing* JavaScript, it may initially feel a little strange not only to those with a background in traditional compilers, for example because emitted diagnostics do not happen linearly, but also to those with a background in TypeScript, because even type annotations remain unchecked as part of dead code. The exception to the rule is top-level code, including top-level variable declarations and their initializers, that must be evaluated as soon as the respective file would first execute.

So far, so good. Shall we continue with a [status of WebAssembly and language features](./status.md)?
