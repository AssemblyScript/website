---
description: A collection of examples that one can play around with right in the browser or copy to a local project.
sidebarDepth: 0
---

# Examples

A collection of various AssemblyScript examples.

## Starter examples

Small entertaining programs showcasing low-level WebAssembly capabilities. These compile to less than one or just a few kilobytes so their text format is easy to grasp.

### [Mandelbrot](./examples/mandelbrot.html)

Renders the Mandelbrot set to a canvas using 2048 discrete color values computed on the JS side.

<Badge text="easy" type="tip"/>

[![Preview image](images/mandelbrot-preview.jpg)](./examples/mandelbrot.html)

### [Interference](./examples/interference.html)

Animates and renders an interference pattern to a canvas while keeping the image buffer in WebAssembly.

<Badge text="easy" type="tip"/>

[![Preview image](images/interference-preview.jpg)](./examples/interference.html)

### [Game of Life](./examples/game-of-life.html)

Continuously updates a cellular automaton and visualizes its state on a canvas according to user input.

<Badge text="intermediate" type="warning"/>

[![Preview image](images/game-of-life-preview.jpg)](./examples/game-of-life.html)

## More examples

Various more advanced examples are available as part of the [examples repository](https://github.com/AssemblyScript/examples), including examples of [using the loader](https://github.com/AssemblyScript/examples/tree/master/loader), [creating (node) libraries](https://github.com/AssemblyScript/examples/tree/master/i64), [utilizing the browser SDK](https://github.com/AssemblyScript/examples/tree/master/sdk) and [hooking into the compiler using transforms](https://github.com/AssemblyScript/examples/tree/master/transform).

If you are interested in learning more about specific concepts, also make sure to give [Wasm By Example](https://wasmbyexample.dev/) a read.
