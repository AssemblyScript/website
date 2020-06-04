---
description: There is something appealing to it, isn't it?
---

# Basics

WebAssembly is fundamentally different from JavaScript, ultimately enabling entirely new use cases not only on the web. Consequently, AssemblyScript is much more similar to a static compiler than it is to a JavaScript VM. One can think of it as if TypeScript and C had a somewhat special child.

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

## Current limitations

Not all language features are equally straight-forward to implement on top of just the WebAssembly MVP, so there are certain features we are still working on while waiting for their respective proposals to become available.

### Closures

Closures are not yet supported \(waiting for [Function References](https://github.com/WebAssembly/function-references) 🦄 / [GC](https://github.com/WebAssembly/gc) 🦄\), so accessing a local variable captured by an inner function will report an error.

```ts
function computeSum(arr: i32[]): i32 {
  var sum = 0
  arr.forEach(value => {
    sum += value // error
  })
  return sum
}
```

In the meantime we recommend to either use a global \(top-level variable\)

```ts
var sum = 0 // now becomes a Global
function computeSum(arr: i32[]): i32 {
  arr.forEach(value => {
    sum += value // works
  })
  return sum
}
```

or to adapt code where possible:

```ts
let sum = 0
for (let i = 0; i < arr.length; ++i) {
  sum += arr[i] // works
}
```

### Exceptions

Exceptions are not yet supported \(waiting for [Exception Handling](https://github.com/WebAssembly/exception-handling) 🦄\), so the following cannot be caught and will instead `abort` \(i.e. crash\) the program:

```ts
function doThrow(): void {
  throw new Error("message")
}
```

In the meantime we recommend to avoid the use of `try`, `catch`, `finally` and `throw` and do as they did in the olden days, i.e. return an error code or `null` to indicate.

### Triple equals \(===\)

The triple equals binary operation performs an identity equality check \(i.e. the exact same object\) currently. This has its origins in the early requirements of the Standard Library, but is going to change to JavaScript-like semantics in the near future. In the meantime, use `==` and `!=` with strings in case of doubt.

## Frequently asked questions

We've also collected a few questions that may arise before, at or after this point. so if you're wondering about one thing or another, here it is:

### Is WebAssembly going to supersede JavaScript?

No, and it is not meant to do so. There are use cases one can handle "better" than the other, with "better" depending on the use case. This can be making an algorithm performing with less overhead on the one hand or getting an UI job done quicker on the other. As always, picking the right tool for the job is key, and AssemblyScript just so happens to blur the line a bit.

### Is WebAssembly _always_ faster?

No, not always. But it can be. The execution characteristics of ahead-of-time compiled WebAssembly differ from just-in-time compiled JavaScript in that it is _more predictable_ in a way that enables a WebAssembly program to remain on a reasonably fast path over the entire course of execution, while a JavaScript VM tries hard to do all sorts of smart optimizations before and _while_ the code is executing. This implies that a JavaScript VM can make both very smart decisions, especially for well-written code with a clear intent, but might also have to reconsider its strategy to do something more general if its assumptions did not hold. If you are primarily interested in performance, our rule of thumb \(that is: from an AssemblyScript perspective\) is:

| Scenario                      | Recommendation
| :---------------------------- | :-------------
| Compute-heavy algorithm       | Use WebAssembly
| Mostly interacts with the DOM | Mostly use JavaScript
| Games                         | Use WebAssembly for CPU-intensive parts
| WebGL                         | Depends how much of it is calling APIs. Probably both.
| Websites, Blogs, ...          | JavaScript is your friend

Or: WebAssembly is great for computational tasks, stuff with numbers, but still needs some time to become more convenient and efficient _at the same time_ where sharing numbers between the module and the host isn't enough.

Bonus: If you are considering another language than AssemblyScript, pick one that doesn't \(currently\) compile an interpreter to WebAssembly to run your code, because that's neither small nor fast.

Bonus: At this point in time, when a tool does WebAssembly⇄JavaScript bindings for you, appreciate its convenience, but also take care of what it actually does. For example, what looks like just passing a function argument might involve allocating/copying memory with implicit conversions like re-encoding a string.

### Is AssemblyScript _always_ faster?

No, not always. But there are use cases especially well-suited for it, like creating a Game Boy emulator by making use of its low-level capabilities, essentially emitting raw WebAssembly using a nicer syntax. But ordinary code doesn't magically become faster just by compiling to WebAssembly, especially when making extensive use of managed objects that require memory management and garbage collection \(this has its cost in every language\) or talking to the host in structures that WebAssembly isn't currently good at, like strings or more complex objects. Low-level code \(just functions, numbers, math and hard work\) is always the best choice when all you care about is raw performance.

### How does AssemblyScript compare/relate to C++/Rust?

First and foremost: Both Emscripten \(C++\) and Rust have very mature tooling to compile to WebAssembly and are made by the smartest people on this field. Also, both can make use of compiler infrastructure that has been created by many individuals and corporations over years. In contrast, AssemblyScript is a relatively young project with limited resources that strives to create a viable alternative from another perspective.

More precisely: AssemblyScript is putting anything web - from APIs to syntax to WebAssembly - first and _then_ glues it all together, while others lift an existing ecosystem to the web. Fortunately, there is Binaryen, a compiler infrastructure and toolchain library for WebAssembly primarily created by the main author of Emscripten, that we can utilize to considerably close the gap, and we are very thankful for that. It's not as optimal for AssemblyScript-generated code as it is for LLVM-generated code in a few cases, but it's already pretty good and continuously becoming better. It's also noteworthy that AssemblyScript is still behind in specific language features, but we are working on that.

In short: AssemblyScript differs in that it is new and tries another approach. It's not as mature as Emscripten and Rust, but there is something about the idea that is definitely appealing. If you find it appealing as well, AssemblyScript is for you.

---

That being said, the following sections cover what AssemblyScript can or cannot do already, one piece at a time. Enjoy!
