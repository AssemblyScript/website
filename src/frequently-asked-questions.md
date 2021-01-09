---
description: A collection of general WebAssembly and AssemblyScript questions and their answers.
sidebarDepth: 0
---

# Frequently asked questions

Questions that may arise before, at or after this point. so if you're wondering about one thing or another, here it is:

## Is WebAssembly going to supersede JavaScript?

No, and it is not meant to do so. There are use cases one can handle "better" than the other, with "better" depending on the use case. This can be making an algorithm performing with less overhead on the one hand or getting an UI job done quicker on the other. As always, picking the right tool for the job is key, and AssemblyScript just so happens to blur the line a bit.

## Is WebAssembly _always_ faster?

No, not always. But it can be. The execution characteristics of ahead-of-time compiled WebAssembly differ from just-in-time compiled JavaScript in that it is _more predictable_ in a way that enables a WebAssembly program to remain on a reasonably fast path over the entire course of execution, while a JavaScript VM tries hard to do all sorts of smart optimizations before and _while_ the code is executing. This implies that a JavaScript VM can make both very smart decisions, especially for well-written code with a clear intent, but might also have to reconsider its strategy to do something more general if its assumptions did not hold. If you are primarily interested in performance, our rule of thumb \(that is: from an AssemblyScript perspective\) is:

| Scenario                      | Recommendation
| :---------------------------- | :-------------
| Compute-heavy algorithm       | Use WebAssembly
| Mostly interacts with the DOM | Mostly use JavaScript
| Games                         | Use WebAssembly for CPU-intensive parts
| WebGL                         | Depends how much of it is calling APIs. Probably both.
| Websites, Blogs, ...          | JavaScript is your friend

Or: WebAssembly is great for computational tasks, stuff with numbers, but still needs some time to become more convenient and efficient _at the same time_ where sharing numbers between the module and the host isn't enough.

## Is AssemblyScript _always_ faster?

No, not always. But there are use cases especially well-suited for it, like creating a Game Boy emulator by making use of its low-level capabilities, essentially emitting raw WebAssembly using a nicer syntax. But ordinary code doesn't magically become faster just by compiling to WebAssembly, especially when making extensive use of managed objects that require memory management and garbage collection \(this has its cost in every language\) or talking to the host in structures that WebAssembly isn't currently good at, like strings or more complex objects. Low-level code \(just functions, numbers, math and hard work\) is always the best choice when all you care about is raw performance.

## How does AssemblyScript compare/relate to C++/Rust?

First and foremost: Both Emscripten \(C++\) and Rust have very mature tooling to compile to WebAssembly and are made by the smartest people in this field. Also, both can make use of compiler infrastructure that has been created by many individuals and corporations over years. In contrast, AssemblyScript is a relatively young project with limited resources that strives to create a viable alternative from another perspective.

More precisely: AssemblyScript is putting anything web - from APIs to syntax to WebAssembly - first and _then_ glues it all together, while others lift an existing ecosystem to the web. We believe that both approaches are fantastic. Fortunately for us, there is Binaryen, a compiler infrastructure and toolchain library for WebAssembly primarily created by the main author of Emscripten, that we can utilize to considerably close the gap, and we are very thankful for that. It's not as optimal for AssemblyScript-generated code as it is for LLVM-generated code in a few cases, but it's already pretty good and continuously becoming better. It's also noteworthy that AssemblyScript is still behind in specific language features, but we are working on that.

In short: AssemblyScript differs in that it is new and tries another approach. It's not as mature as Emscripten and Rust, but there is something about the idea that is definitely appealing. If you find it appealing as well, AssemblyScript is for you.
