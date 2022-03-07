---
description: Rendering an interference effect in AssemblyScript.
---

# Interference example

Colin Eberhardt's and Ben Smith's [WebAssembly interference effect](https://github.com/ColinEberhardt/wasm-interference), if it was written in AssemblyScript.

## Contents

* Exporting functions and variables from a WebAssembly module.
* Calling functions and reading variables exported from WebAssembly.
* Utilizing 32-bit floating point math to speed up calculations by utilizing `Mathf`.
* Keeping an image buffer within the module's memory and copying it to a canvas.
* Manually growing memory depending on the size of the viewport on the browser side.
* And finally: Continuously updating and rendering the image buffer.

## Example

::: danger EPILEPSY WARNING
A very small percentage of individuals may experience epileptic seizures when exposed to certain light patterns or flashing lights. Exposure to certain patterns or backgrounds on a computer screen may induce an epileptic seizure in these individuals. Certain conditions may induce previously undetected epileptic symptoms even in persons who have no history of prior seizures or epilepsy.

If you experience any of the following symptoms while viewing - dizziness, altered vision, eye or muscle twitches, loss of awareness, disorientation, any involuntary movement, or convulsions - IMMEDIATELY discontinue use and consult your physician.
:::

```editor
#!optimize=speed&runtime=stub
var width  = 320;
var height = 200;

// Let's utilize the entire heap as our image buffer
export const offset = __heap_base;

/** Sets a single pixel's color. */
function set(x: i32, y: i32, v: f32): void {
  var vi = <i32>v;
  store<i32>(offset + ((width * y + x) << 2), ~vi << 24 | vi << 8);
}

/** Computes the distance between two pixels. */
function distance(x1: i32, y1: i32, x2: f32, y2: f32): f32 {
  var dx = <f32>x1 - x2;
  var dy = <f32>y1 - y2;
  return Mathf.sqrt(dx * dx + dy * dy);
}

/** Performs one tick. */
export function update(tick: f32): void {
  var w = <f32>width;
  var h = <f32>height;
  var hw = w * 0.5,
      hh = h * 0.5;
  var cx1 = (Mathf.sin(tick * 2) + Mathf.sin(tick      )) * hw * 0.3 + hw,
      cy1 = (Mathf.cos(tick)                            ) * hh * 0.3 + hh,
      cx2 = (Mathf.sin(tick * 4) + Mathf.sin(tick + 1.2)) * hw * 0.3 + hw,
      cy2 = (Mathf.sin(tick * 3) + Mathf.cos(tick + 0.1)) * hh * 0.3 + hh;
  var res = <f32>48 / Mathf.max(w, h);
  var y = 0;
  do {
    let x = 0;
    do {
      set(x, y, Mathf.abs(
        Mathf.sin(distance(x, y, cx1, cy1) * res) +
        Mathf.sin(distance(x, y, cx2, cy2) * res)
      ) * 120);
    } while (++x != width)
  } while (++y != height)
}

/** Recomputes and potentially grows memory on resize of the viewport. */
export function resize(w: i32, h: i32): void {
  width = w; height = h;
  // Pages are 64kb. Rounds up using mask 0xffff before shifting to pages.
  var needed = <i32>((offset + (w * h * sizeof<i32>() + 0xffff)) & ~0xffff) >>> 16;
  var actual = memory.size();
  if (needed > actual) memory.grow(needed - actual);
}

#!html
<canvas id="canvas" style="width: 100%; height: 100%; background: #aff"></canvas>
<script type="module">
const exports = await instantiate(await compile());
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const step = 0.012;

// Upscale the image to speed up calculations
const upscaleFactor = 4;

var width, height, image;

// Inform the module about the viewport's size, incl. on resize
function onresize() {
  width = (canvas.offsetWidth / upscaleFactor) | 0;
  height = (canvas.offsetHeight / upscaleFactor) | 0;
  canvas.width = width;
  canvas.height = height;
  image = context.createImageData(width, height);
  exports.resize(width, height);
}
onresize();
new ResizeObserver(onresize).observe(canvas);

// Keep updating the image
var tick = 0.0;
(function update() {
  requestAnimationFrame(update);
  exports.update(tick += step);
  new Uint32Array(image.data.buffer).set(new Uint32Array(exports.memory.buffer, exports.offset.value, width * height));
  context.putImageData(image, 0, 0);
})();
</script>
```

::: tip NOTE
The example makes one important assumption: Since we are not using a sophisticated runtime, we can instead repurpose the entire heap, starting at `__heap_base`, as our image buffer.

As soon as this condition is no longer met, one would instead either reserve some space by specifying a suitable `--memoryBase` or export a dynamically instantiated chunk of memory, like an `Uint32Array`, and utilize it as the image buffer both in WebAssembly and in JavaScript.
:::


## Running locally

Set up a new AssemblyScript project as described in [Quick start](../quick-start.md) and copy `module.ts` to `assembly/index.ts` and `index.html` to the project's top-level directory. Edit the build commands in `package.json` to include

```
--runtime stub
```

The example can now be compiled with

```sh
npm run asbuild
```

To view the example, one can modify the instantiation in `index.html` from

```js
loader.instantiate(module_wasm).then(({ exports }) => {
```

to

```js
WebAssembly.instantiateStreaming(fetch('./build/optimized.wasm'), {
  JSMath: Math
}).then(({ exports }) => {
```

because using the [loader](../loader.md) is not ultimately necessary here (no managed objects are exchanged). If the loader is used instead, it will automatically provide `JSMath`.

Some browsers may restrict `fetch`ing local resources when just opening `index.html` now, but one can set up a local server as a workaround:

```sh
npm install --save-dev http-server
http-server . -o -c-1
```
