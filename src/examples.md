---
description: A collection of AssemblyScript examples that one can play around with right in the browser.
sidebarDepth: 0
---

# Examples

A collection of AssemblyScript examples and [snippets](./examples/snippets.md).

## Starter examples

Small entertaining programs showcasing low-level WebAssembly capabilities. These compile to less than one or just a few kilobytes so their text format is easy to grasp.

### [Mandelbrot](./examples/mandelbrot.md)

Renders the Mandelbrot set to a canvas using 2048 discrete color values computed on the JS side.

<Badge text="easy" type="tip"/>

[![Preview image](images/mandelbrot-preview.jpg)](./examples/mandelbrot.md)

### [Interference](./examples/interference.md)

Animates and renders an interference pattern to a canvas while keeping the image buffer in WebAssembly.

<Badge text="easy" type="tip"/>

[![Preview image](images/interference-preview.jpg)](./examples/interference.md)

### [Game of Life](./examples/game-of-life.md)

Continuously updates a cellular automaton and visualizes its state on a canvas according to user input.

<Badge text="intermediate" type="warning"/>

[![Preview image](images/game-of-life-preview.jpg)](./examples/game-of-life.md)

## Advanced examples

### [Arrays](./examples/arrays.md)

Shows how to exchange and work with arrays using the loader.

<Badge text="intermediate" type="warning"/>

### Examples repository

Various more advanced examples are available as part of the [examples repository](https://github.com/AssemblyScript/examples), including a sophisticated example of [using the loader](https://github.com/AssemblyScript/examples/tree/main/loader), [creating (node) libraries](https://github.com/AssemblyScript/examples/tree/main/i64), [utilizing the browser SDK](https://github.com/AssemblyScript/examples/tree/main/sdk) and [hooking into the compiler using transforms](https://github.com/AssemblyScript/examples/tree/main/transform).

## Additional resources

If you are interested in learning more about specific concepts, also make sure to give [Wasm By Example](https://wasmbyexample.dev/) a read.
