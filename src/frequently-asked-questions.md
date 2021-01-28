---
description: A collection of general WebAssembly and AssemblyScript questions and their answers.
sidebarDepth: 0
---

# Frequently asked questions

Questions that may arise before, at or after this point. so if you're wondering about one thing or another, here it is:

## Is WebAssembly going to supersede JavaScript?

Probably not, and it is not meant to do so. There are use cases one can handle "better" than the other, with "better" depending on requirements. A requirement can be to make an algorithm performing with little overhead on the one hand, which is where WebAssembly is good at, or getting an UI job done quicker on the other, which JavaScript is great for. As always, picking the right tool for the job is key, and AssemblyScript just so happens to blur the line a bit.

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

## How does AssemblyScript compare/relate to C++/Rust?

First and foremost: Both Emscripten \(C++\) and Rust have very mature tooling to compile to WebAssembly and are made by the smartest people in this field. Also, both can make use of compiler infrastructure that has been created by many individuals and corporations over years. In contrast, AssemblyScript is a relatively young project with limited resources that strives to create a viable alternative from another perspective.

More precisely: AssemblyScript is putting anything web - from APIs to syntax to WebAssembly - first and _then_ glues it all together, while others lift an existing ecosystem to the web. We believe that both approaches are fantastic, and fortunately for us, there is Binaryen, a compiler infrastructure and toolchain library for WebAssembly primarily created by the main author of Emscripten, that we can utilize to considerably close the gap. We are very thankful for it. Binaryen is not as optimal for AssemblyScript-generated code as it is for LLVM-generated code in a few cases, but it's already pretty good and continuously becoming better. It's also noteworthy that AssemblyScript is still behind in specific language features, but we are working on that.

In short: AssemblyScript differs in that it is new and tries another approach. It's not as mature as Emscripten and Rust, but there is something about the idea that is definitely appealing. If you find it appealing as well, AssemblyScript is for you.

## Will AssemblyScript support all of TypeScript eventually?

It very likely won't. While TypeScript adds *some* static typing to JavaScript, its type system also tries to describe any possible dynamic feature of JavaScript. TypeScript is a superset of JavaScript after all. As such there is a point where it becomes infeasible to support JavaScript features that TypeScript can describe without adding an interpreter mode to AssemblyScript, which is a non-goal.

## Will interop between AssemblyScript and JavaScript become better?

This is an open question. While there are WebAssembly proposals specifically aiming at improving interop, not all of them consider excellent interoperability between WebAssembly and the existing web platform as important as we do.

One point of disagreement for example stems from AssemblyScript's decision to chose JavaScript's 16-bit string encoding as a basis, initially exactly to aid compatibility and interop on the web, while others primarily interested in systems languages are advocating for just UTF-8. The UTF-8 everywhere sentiment may appear noble on paper, yet the reality we live in is that it would unnecessarily handicap AssemblyScript or other languages with most of their APIs designed for 16-bit Unicode, due to always having to re-encode and/or copy or alternatively having to break their APIs to be efficient. Our hopes are, however, since Java, .NET and many more languages are facing a similar challenge, that there'll ultimately be a solution that covers more languages.

Similarly, WebAssembly has primarily been designed with systems languages in mind so far and it did an exceptional job at bringing these to the web, yet it appears that the now predominant low-level mindset may eventually run counter to designing features that work well with the existing web platform, which is rather high-level. As such it is still subject to discussion whether for example WebAssembly GC strings, arrays and other objects will have good interop with JavaScript, or if JavaScript strings, arrays and other objects will have good interop with WebAssembly GC respectively. It is certainly important to design these APIs carefully, yet, in our opinion, WebAssembly may be missing the opportunity of its lifetime if it is not designed with excellent interop with JavaScript and the web in mind.

If you are interested in these aspects, feel free to join us in the respective spec discussions to inform the process.

## How can I help?

There are various ways to help. AssemblyScript is an open source project, and everyone is welcome to contribute [code](https://github.com/AssemblyScript/assemblyscript), [documentation](https://github.com/AssemblyScript/website), or [time](https://github.com/AssemblyScript/community-group). We also have an [OpenCollective](https://opencollective.com/assemblyscript) for those preferring to help the project out with a sponsorship.
