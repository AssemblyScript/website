---
description: A collection of general WebAssembly and AssemblyScript questions and their answers.
---

# Frequently asked questions

Questions that may arise before, at or after this point. so if you're wondering about one thing or another, here it is:

## Is WebAssembly faster than JavaScript?

Not always, but it can be. The execution characteristics of ahead-of-time compiled WebAssembly differ from just-in-time compiled JavaScript in that it is _more predictable_ in a way that enables a WebAssembly program to remain on a reasonably fast path over the entire course of execution, while a JavaScript VM tries hard to do all sorts of smart optimizations before and _while_ the code is executing. This implies that a JavaScript VM can make both very smart decisions, especially for well-written code with a clear intent, but might also have to reconsider its strategy to do something more general if its assumptions did not hold. If you are primarily interested in performance, rules of thumb could be:

| Scenario                      | Recommendation
| :---------------------------- | :-------------
| Compute-heavy algorithm       | Use WebAssembly
| Mostly interacts with the DOM | Mostly use JavaScript
| Games                         | Use WebAssembly for CPU-intensive parts
| WebGL                         | Depends how much of it is calling APIs. Probably both.
| Websites, Blogs, ...          | JavaScript is your friend

Or: WebAssembly is great for computational tasks, stuff with numbers, but still needs some time to become more convenient and efficient _at the same time_ where sharing numbers between the module and the host is not enough.

## Is AssemblyScript faster than JavaScript?

Not always, but there are use cases especially well-suited for it, like creating a Game Boy emulator by making use of its low-level capabilities, essentially emitting raw WebAssembly using a nicer syntax. But pre-existing TypeScript code doesn't magically become faster just by compiling to WebAssembly, especially when making extensive use of managed objects that require memory management and garbage collection \(this has its cost in every language\) or talking to the host in structures that WebAssembly isn't currently good at, like strings or more complex objects. Low-level code \(just functions, numbers, math and hard work\) is always the best choice when all you care about is raw performance.

## Will AssemblyScript support all of TypeScript eventually?

It very likely won't. While TypeScript adds *some* static typing to JavaScript, its type system also tries to describe any possible dynamic feature of JavaScript. TypeScript is a superset of JavaScript after all. As such there is a point where it becomes infeasible to support JavaScript features that TypeScript can describe without adding an interpreter mode to AssemblyScript, which is a non-goal.

## How can I help?

There are various ways to help. AssemblyScript is an open source project, and everyone is welcome to contribute [code](https://github.com/AssemblyScript/assemblyscript), [documentation](https://github.com/AssemblyScript/website), or time. We also have an [OpenCollective](https://opencollective.com/assemblyscript) for those preferring to help the project out with a sponsorship.
