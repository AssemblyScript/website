---
description: Rendering the Mandelbrot set in AssemblyScript.
---

# Mandelbrot example

Renders the [Mandelbrot set](https://en.wikipedia.org/wiki/Mandelbrot_set) to a canvas using 2048 discrete color values computed on the JS side.

## Contents

* Exporting functions from a WebAssembly module.
* Calling functions exported from WebAssembly.
* Instantiating the module's memory in JavaScript and import it using `--importMemory`.
* Utilizing JavaScript's `Math` instead of native libm to reduce module size via `--use Math=JSMath`.
* And finally: Reading and translating data from WebAssembly memory to colors rendered to a canvas.

## Example

```editor
#!optimize=speed&runtime=none&importMemory&use=Math=JSMath
/** Number of discrete color values on the JS side. */
const NUM_COLORS = 2048;

/** Updates the rectangle `width` x `height`. */
export function update(width: u32, height: u32, limit: u32): void {
  var translateX = width  * (1.0 / 1.6);
  var translateY = height * (1.0 / 2.0);
  var scale      = 10.0 / min(3 * width, 4 * height);
  var realOffset = translateX * scale;
  var invLimit   = 1.0 / limit;

  var minIterations = min(8, limit);

  for (let y: u32 = 0; y < height; ++y) {
    let imaginary = (y - translateY) * scale;
    let yOffset   = (y * width) << 1;

    for (let x: u32 = 0; x < width; ++x) {
      let real = x * scale - realOffset;

      // Iterate until either the escape radius or iteration limit is exceeded
      let ix = 0.0, iy = 0.0, ixSq: f64, iySq: f64;
      let iteration: u32 = 0;
      while ((ixSq = ix * ix) + (iySq = iy * iy) <= 4.0) {
        iy = 2.0 * ix * iy + imaginary;
        ix = ixSq - iySq + real;
        if (iteration >= limit) break;
        ++iteration;
      }

      // Do a few extra iterations for quick escapes to reduce error margin
      while (iteration < minIterations) {
        let ixNew = ix * ix - iy * iy + real;
        iy = 2.0 * ix * iy + imaginary;
        ix = ixNew;
        ++iteration;
      }

      // Iteration count is a discrete value in the range [0, limit] here, but we'd like it to be
      // normalized in the range [0, 2047] so it maps to the gradient computed in JS.
      // see also: http://linas.org/art-gallery/escape/escape.html
      let colorIndex = NUM_COLORS - 1;
      let distanceSq = ix * ix + iy * iy;
      if (distanceSq > 1.0) {
        let fraction = Math.log2(0.5 * Math.log(distanceSq));
        colorIndex = <u32>((NUM_COLORS - 1) * clamp<f64>((iteration + 1 - fraction) * invLimit, 0.0, 1.0));
      }
      store<u16>(yOffset + (x << 1), colorIndex);
    }
  }
}

/** Clamps a value between the given minimum and maximum. */
function clamp<T>(value: T, minValue: T, maxValue: T): T {
  return min(max(value, minValue), maxValue);
}

#!html
<canvas id="canvas" style="width: 100%; height: 100%"></canvas>
<script>

// Set up the canvas with a 2D rendering context
const canvas = document.getElementById("canvas");
const boundingRect = canvas.getBoundingClientRect();
const ctx = canvas.getContext("2d");

// Compute the size of the viewport
const ratio  = window.devicePixelRatio || 1;
const width  = (boundingRect.width  | 0) * ratio;
const height = (boundingRect.height | 0) * ratio;
const size = width * height;
const byteSize = size << 1; // discrete color indices in range [0, 2047] (2 bytes per pixel)

canvas.width  = width;
canvas.height = height;

ctx.scale(ratio, ratio);

// Compute the size (in pages) of and instantiate the module's memory.
// Pages are 64kb. Rounds up using mask 0xffff before shifting to pages.
const memory = new WebAssembly.Memory({ initial: ((byteSize + 0xffff) & ~0xffff) >>> 16 });
const buffer = new Uint16Array(memory.buffer);
const imageData = ctx.createImageData(width, height);
const argb = new Uint32Array(imageData.data.buffer);

loader.instantiate(module_wasm, {
  env: {
    memory
  }
}).then(({ exports }) => {
  var computeLine = exports.computeLine

  // Update state
  exports.update(width, height, 40);

  // Translate 16-bit color indices to colors
  for (let y = 0; y < height; ++y) {
    const yx = y * width;
    for (let x = 0; x < width; ++x) {
      argb[yx + x] = colors[buffer[yx + x]];
    }
  }

  // Render the image buffer.
  ctx.putImageData(imageData, 0, 0);
});

/** Computes a nice set of colors using a gradient. */
function computeColors() {
  const canvas = document.createElement("canvas");
  canvas.width = 2048;
  canvas.height = 1;
  const ctx = canvas.getContext("2d");
  const grd = ctx.createLinearGradient(0, 0, 2048, 0);
  grd.addColorStop(0.00, "#000764");
  grd.addColorStop(0.16, "#2068CB");
  grd.addColorStop(0.42, "#EDFFFF");
  grd.addColorStop(0.6425, "#FFAA00");
  grd.addColorStop(0.8575, "#000200");
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, 2048, 1);
  return new Uint32Array(ctx.getImageData(0, 0, 2048, 1).data.buffer);
}

const colors = computeColors();
</script>
```

::: tip NOTE
The example makes a couple assumptions. For instance, using the entire memory of the program as the image buffer as in this example is only possible because we know that no interferring static memory segments will be created, which is achieved by

* using JavaScript's Math instead of native libm (usually adds lookup tables),
* not using a more sophisticated runtime (typically adds bookkeeping) and
* the rest of the example being relatively simple (i.e. no strings or similar).

As soon as these conditions are no longer met, one would instead either reserve some space by specifying a suitable `--memoryBase` or export a dynamically instantiated chunk of memory, like an `Uint16Array`, and utilize it as the color index buffer both in WebAssembly and in JavaScript.
:::

## Running locally

Set up a new AssemblyScript project as described in [Quick start](http://localhost:8080/quick-start.html) and copy `module.ts` to `assembly/index.ts` and `index.html` to the project's top-level directory. Edit the build commands in `package.json` to include

```
--runtime none --use Math=JSMath --importMemory
```

The example can now be compiled with

```sh
npm run asbuild
```

To view the example, one can modify the instantiation in `index.html` from

```js
loader.instantiate(module_wasm, {
  env: {
    memory
  }
}).then(({ exports }) => {
```

to

```js
WebAssembly.instantiateStreaming(fetch('./build/optimized.wasm'), {
  env: {
    memory
  },
  JSMath: Math
}).then(({ exports }) => {
```

because using the [loader](../loader.html) is not ultimately necessary here (no managed objects are exchanged). If the loader is used instead, it will automatically provide `JSMath`.

Some browsers may restrict `fetch`ing local resources when just opening `index.html` now, but one can set up a local server as a workaround:

```sh
npm install --save-dev http-server
http-server . -o -c-1
```
