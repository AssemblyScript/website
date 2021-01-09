---
description: Rendering Conway's Game of Life in AssemblyScript.
---

# Game of Life example

Continuously updates a slightly modified variant of [Conway's Game of Life](https://en.wikipedia.org/wiki/Conway's_Game_of_Life) and visualizes its state on a canvas.

## Contents

* Exporting functions from a WebAssembly module.
* Calling functions exported from WebAssembly.
* Importing configuration values from JavaScript.
* Instantiating the module's memory in JavaScript and import it using `--importMemory`.
* Speeding up a program by forcing helper functions in a hot path to always `@inline`.
* Utilizing JavaScript's `Math` instead of native libm to reduce module size via `--use Math=JSMath`.
* Reacting to user input by directly modifying an input image buffer.
* Finding out about WebAssembly's unintuitive byte order.
* And finally: Continuously updating an input to an output image buffer and rendering the output image buffer.
* Featuring: Clicking and drawing lots of *stuff*.

## Example

```editor
#!optimize=speed&runtime=stub&importMemory&use=Math=JSMath
// Configuration imported from JS
declare const BGR_ALIVE: u32;
declare const BGR_DEAD: u32;
declare const BIT_ROT: u32;

var width: i32, height: i32, offset: i32;

/** Gets an input pixel in the range [0, s]. */
@inline
function get(x: u32, y: u32): u32 {
  return load<u32>((y * width + x) << 2);
}

/** Sets an output pixel in the range [s, 2*s]. */
@inline
function set(x: u32, y: u32, v: u32): void {
  store<u32>((offset + y * width + x) << 2, v);
}

/** Sets an output pixel in the range [s, 2*s] while fading it out. */
@inline
function rot(x: u32, y: u32, v: u32): void {
  var alpha = max<i32>((v >> 24) - BIT_ROT, 0);
  set(x, y, (alpha << 24) | (v & 0x00ffffff));
}

/** Initializes width and height. Called once from JS. */
export function init(w: i32, h: i32): void {
  width  = w;
  height = h;
  offset = w * h;

  // Start by filling output with random live cells.
  for (let y = 0; y < h; ++y) {
    for (let x = 0; x < w; ++x) {
      let c = Math.random() > 0.1
        ? BGR_DEAD  & 0x00ffffff
        : BGR_ALIVE | 0xff000000;
      set(x, y, c);
    }
  }
}

/** Performs one step. Called about 30 times a second from JS. */
export function step(): void {
  var w = width,
      h = height;

  var hm1 = h - 1, // h - 1
      wm1 = w - 1; // w - 1

  // The universe of the Game of Life is an infinite two-dimensional orthogonal grid of square
  // "cells", each of which is in one of two possible states, alive or dead.
  for (let y = 0; y < h; ++y) {
    let ym1 = y == 0 ? hm1 : y - 1,
        yp1 = y == hm1 ? 0 : y + 1;
    for (let x = 0; x < w; ++x) {
      let xm1 = x == 0 ? wm1 : x - 1,
          xp1 = x == wm1 ? 0 : x + 1;

      // Every cell interacts with its eight neighbours, which are the cells that are horizontally,
      // vertically, or diagonally adjacent. Least significant bit indicates alive or dead.
      let aliveNeighbors = (
        (get(xm1, ym1) & 1) + (get(x, ym1) & 1) + (get(xp1, ym1) & 1) +
        (get(xm1, y  ) & 1)                     + (get(xp1, y  ) & 1) +
        (get(xm1, yp1) & 1) + (get(x, yp1) & 1) + (get(xp1, yp1) & 1)
      );

      let self = get(x, y);
      if (self & 1) {
        // A live cell with 2 or 3 live neighbors rots on to the next generation.
        if ((aliveNeighbors & 0b1110) == 0b0010) rot(x, y, self);
        // A live cell with fewer than 2 or more than 3 live neighbors dies.
        else set(x, y, BGR_DEAD | 0xff000000);
      } else {
        // A dead cell with exactly 3 live neighbors becomes a live cell.
        if (aliveNeighbors == 3) set(x, y, BGR_ALIVE | 0xff000000);
        // A dead cell with fewer or more than 3 live neighbors just rots.
        else rot(x, y, self);
      }
    }
  }
}

/** Fills the row and column indicated by `x` and `y` with random live cells. */
export function fill(x: u32, y: u32, p: f64): void {
  for (let ix = 0; ix < width; ++ix) {
    if (Math.random() < p) set(ix, y, BGR_ALIVE | 0xff000000);
  }
  for (let iy = 0; iy < height; ++iy) {
    if (Math.random() < p) set(x, iy, BGR_ALIVE | 0xff000000);
  }
}

#!html
<canvas id="canvas" style="width: 100%; height: 100%; background: #000; cursor: crosshair"></canvas>
<script>
// Configuration
const RGB_ALIVE = 0xD392E6;
const RGB_DEAD  = 0xA61B85;
const BIT_ROT   = 10;

// Set up the canvas with a 2D rendering context
const canvas = document.getElementById("canvas");
const boundingRect = canvas.getBoundingClientRect();
const ctx = canvas.getContext("2d");

// Compute the size of the universe (2 pixels per cell)
const width = boundingRect.width >>> 1;
const height = boundingRect.height >>> 1;
const size = width * height;
const byteSize = (size + size) << 2; // input & output (4 bytes per cell)

canvas.width = width;
canvas.height = height;
canvas.style.imageRendering = "pixelated";
ctx.imageSmoothingEnabled = false;

// Compute the size of and instantiate the module's memory
const memory = new WebAssembly.Memory({ initial: ((byteSize + 0xffff) & ~0xffff) >>> 16 });

// Fetch and instantiate the module
loader.instantiate(module_wasm, {
  env: {
    memory
  },
  module: {
    BGR_ALIVE : rgb2bgr(RGB_ALIVE) | 1, // LSB set indicates alive
    BGR_DEAD  : rgb2bgr(RGB_DEAD) & ~1, // LSB not set indicates dead
    BIT_ROT
  }
}).then(({ exports }) => {
  // Initialize the module with the universe's width and height
  exports.init(width, height);

  var buffer = new Uint32Array(memory.buffer);

  // Update about 30 times a second
  (function update() {
    setTimeout(update, 1000 / 30);
    buffer.copyWithin(0, size, size + size);   // copy output to input
    exports.step();                            // perform the next step
  })();

  // Keep rendering the output at [size, 2*size]
  var imageData = ctx.createImageData(width, height);
  var argb = new Uint32Array(imageData.data.buffer);
  (function render() {
    requestAnimationFrame(render);
    argb.set(buffer.subarray(size, size + size)); // copy output to image buffer
    ctx.putImageData(imageData, 0, 0);            // apply image buffer
  })();

  // When clicked or dragged, fill the current row and column with random live cells
  var down = false;
  [ [canvas, "mousedown"],
    [canvas, "touchstart"]
  ].forEach(eh => eh[0].addEventListener(eh[1], e => down = true));
  [ [document, "mouseup"],
    [document, "touchend"]
  ].forEach(eh => eh[0].addEventListener(eh[1], e => down = false));
  [ [canvas, "mousemove"],
    [canvas, "touchmove"],
    [canvas, "mousedown"]
  ].forEach(eh => eh[0].addEventListener(eh[1], e => {
    if (!down) return;
    var loc;
    if (e.touches) {
      if (e.touches.length > 1) return;
      loc = e.touches[0];
    } else {
      loc = e;
    }
    const currentBoundingRect = canvas.getBoundingClientRect();
    exports.fill(
      ((loc.clientX - currentBoundingRect.left) / currentBoundingRect.width * boundingRect.width) >>> 1,
      ((loc.clientY - currentBoundingRect.top) / currentBoundingRect.height * boundingRect.height) >>> 1,
      0.5
    );
  }));
});

/** Bitshifts an RGB color to BGR instead (WebAssembly is little endian). */
function rgb2bgr(rgb) {
  return ((rgb >>> 16) & 0xff) | (rgb & 0xff00) | (rgb & 0xff) << 16;
}
</script>
```

::: tip NOTE
The example makes a couple assumptions. For instance, using the entire memory of the program as the image buffer as in this example is only possible because we know that no interferring static memory segments will be created, which is achieved by

* using JavaScript's Math instead of native libm (usually adds lookup tables),
* not using a more sophisticated runtime (typically adds bookkeeping) and
* the rest of the example being relatively simple (i.e. no strings or similar).

As soon as these conditions are no longer met, one would instead either reserve some space by specifying a suitable `--memoryBase` or export a dynamically instantiated chunk of memory, like an `Uint32Array`, and utilize it as the input and output image buffers both in WebAssembly and in JavaScript.
:::

## Running locally

Instructions are identical to [those of the Mandelbrot example](./mandelbrot.md#running-locally).
