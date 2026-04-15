export const redirects = JSON.parse("{}")

export const routes = Object.fromEntries([
  ["/built-with-assemblyscript.html", { loader: () => import(/* webpackChunkName: "built-with-assemblyscript.html" */"/Volumes/Archive/Projects/Github/website/src/built-with-assemblyscript.md"), meta: {"title":"Built with AssemblyScript"} }],
  ["/compiler.html", { loader: () => import(/* webpackChunkName: "compiler.html" */"/Volumes/Archive/Projects/Github/website/src/compiler.md"), meta: {"title":"Using the compiler"} }],
  ["/concepts.html", { loader: () => import(/* webpackChunkName: "concepts.html" */"/Volumes/Archive/Projects/Github/website/src/concepts.md"), meta: {"title":"Concepts"} }],
  ["/editor-test.html", { loader: () => import(/* webpackChunkName: "editor-test.html" */"/Volumes/Archive/Projects/Github/website/src/editor-test.md"), meta: {"title":"Editor Test"} }],
  ["/examples.html", { loader: () => import(/* webpackChunkName: "examples.html" */"/Volumes/Archive/Projects/Github/website/src/examples.md"), meta: {"title":"Examples"} }],
  ["/frequently-asked-questions.html", { loader: () => import(/* webpackChunkName: "frequently-asked-questions.html" */"/Volumes/Archive/Projects/Github/website/src/frequently-asked-questions.md"), meta: {"title":"Frequently asked questions"} }],
  ["/getting-started.html", { loader: () => import(/* webpackChunkName: "getting-started.html" */"/Volumes/Archive/Projects/Github/website/src/getting-started.md"), meta: {"title":"Getting started"} }],
  ["/", { loader: () => import(/* webpackChunkName: "index.html" */"/Volumes/Archive/Projects/Github/website/src/index.md"), meta: {"title":""} }],
  ["/introduction.html", { loader: () => import(/* webpackChunkName: "introduction.html" */"/Volumes/Archive/Projects/Github/website/src/introduction.md"), meta: {"title":"Introduction"} }],
  ["/runtime.html", { loader: () => import(/* webpackChunkName: "runtime.html" */"/Volumes/Archive/Projects/Github/website/src/runtime.md"), meta: {"title":"Runtime"} }],
  ["/standards-objections.html", { loader: () => import(/* webpackChunkName: "standards-objections.html" */"/Volumes/Archive/Projects/Github/website/src/standards-objections.md"), meta: {"title":"Standards objections"} }],
  ["/status.html", { loader: () => import(/* webpackChunkName: "status.html" */"/Volumes/Archive/Projects/Github/website/src/status.md"), meta: {"title":"Implementation status"} }],
  ["/types.html", { loader: () => import(/* webpackChunkName: "types.html" */"/Volumes/Archive/Projects/Github/website/src/types.md"), meta: {"title":"Types"} }],
  ["/examples/arrays.html", { loader: () => import(/* webpackChunkName: "examples_arrays.html" */"/Volumes/Archive/Projects/Github/website/src/examples/arrays.md"), meta: {"title":"Arrays example"} }],
  ["/examples/game-of-life.html", { loader: () => import(/* webpackChunkName: "examples_game-of-life.html" */"/Volumes/Archive/Projects/Github/website/src/examples/game-of-life.md"), meta: {"title":"Game of Life example"} }],
  ["/examples/interference.html", { loader: () => import(/* webpackChunkName: "examples_interference.html" */"/Volumes/Archive/Projects/Github/website/src/examples/interference.md"), meta: {"title":"Interference example"} }],
  ["/examples/mandelbrot.html", { loader: () => import(/* webpackChunkName: "examples_mandelbrot.html" */"/Volumes/Archive/Projects/Github/website/src/examples/mandelbrot.md"), meta: {"title":"Mandelbrot example"} }],
  ["/examples/snippets.html", { loader: () => import(/* webpackChunkName: "examples_snippets.html" */"/Volumes/Archive/Projects/Github/website/src/examples/snippets.md"), meta: {"title":"Snippets"} }],
  ["/stdlib/array.html", { loader: () => import(/* webpackChunkName: "stdlib_array.html" */"/Volumes/Archive/Projects/Github/website/src/stdlib/array.md"), meta: {"title":"Array"} }],
  ["/stdlib/arraybuffer.html", { loader: () => import(/* webpackChunkName: "stdlib_arraybuffer.html" */"/Volumes/Archive/Projects/Github/website/src/stdlib/arraybuffer.md"), meta: {"title":"ArrayBuffer"} }],
  ["/stdlib/console.html", { loader: () => import(/* webpackChunkName: "stdlib_console.html" */"/Volumes/Archive/Projects/Github/website/src/stdlib/console.md"), meta: {"title":"console"} }],
  ["/stdlib/crypto.html", { loader: () => import(/* webpackChunkName: "stdlib_crypto.html" */"/Volumes/Archive/Projects/Github/website/src/stdlib/crypto.md"), meta: {"title":"crypto"} }],
  ["/stdlib/dataview.html", { loader: () => import(/* webpackChunkName: "stdlib_dataview.html" */"/Volumes/Archive/Projects/Github/website/src/stdlib/dataview.md"), meta: {"title":"DataView"} }],
  ["/stdlib/date.html", { loader: () => import(/* webpackChunkName: "stdlib_date.html" */"/Volumes/Archive/Projects/Github/website/src/stdlib/date.md"), meta: {"title":"Date"} }],
  ["/stdlib/error.html", { loader: () => import(/* webpackChunkName: "stdlib_error.html" */"/Volumes/Archive/Projects/Github/website/src/stdlib/error.md"), meta: {"title":"Error"} }],
  ["/stdlib/globals.html", { loader: () => import(/* webpackChunkName: "stdlib_globals.html" */"/Volumes/Archive/Projects/Github/website/src/stdlib/globals.md"), meta: {"title":"Globals"} }],
  ["/stdlib/heap.html", { loader: () => import(/* webpackChunkName: "stdlib_heap.html" */"/Volumes/Archive/Projects/Github/website/src/stdlib/heap.md"), meta: {"title":"heap"} }],
  ["/stdlib/map.html", { loader: () => import(/* webpackChunkName: "stdlib_map.html" */"/Volumes/Archive/Projects/Github/website/src/stdlib/map.md"), meta: {"title":"Map"} }],
  ["/stdlib/math.html", { loader: () => import(/* webpackChunkName: "stdlib_math.html" */"/Volumes/Archive/Projects/Github/website/src/stdlib/math.md"), meta: {"title":"Math"} }],
  ["/stdlib/number.html", { loader: () => import(/* webpackChunkName: "stdlib_number.html" */"/Volumes/Archive/Projects/Github/website/src/stdlib/number.md"), meta: {"title":"Number"} }],
  ["/stdlib/process.html", { loader: () => import(/* webpackChunkName: "stdlib_process.html" */"/Volumes/Archive/Projects/Github/website/src/stdlib/process.md"), meta: {"title":"process"} }],
  ["/stdlib/set.html", { loader: () => import(/* webpackChunkName: "stdlib_set.html" */"/Volumes/Archive/Projects/Github/website/src/stdlib/set.md"), meta: {"title":"Set"} }],
  ["/stdlib/staticarray.html", { loader: () => import(/* webpackChunkName: "stdlib_staticarray.html" */"/Volumes/Archive/Projects/Github/website/src/stdlib/staticarray.md"), meta: {"title":"StaticArray"} }],
  ["/stdlib/string.html", { loader: () => import(/* webpackChunkName: "stdlib_string.html" */"/Volumes/Archive/Projects/Github/website/src/stdlib/string.md"), meta: {"title":"String"} }],
  ["/stdlib/symbol.html", { loader: () => import(/* webpackChunkName: "stdlib_symbol.html" */"/Volumes/Archive/Projects/Github/website/src/stdlib/symbol.md"), meta: {"title":"Symbol"} }],
  ["/stdlib/typedarray.html", { loader: () => import(/* webpackChunkName: "stdlib_typedarray.html" */"/Volumes/Archive/Projects/Github/website/src/stdlib/typedarray.md"), meta: {"title":"TypedArray"} }],
  ["/404.html", { loader: () => import(/* webpackChunkName: "404.html" */"/Volumes/Archive/Projects/Github/website/src/.vuepress/.temp/pages/404.html.vue"), meta: {"title":""} }],
]);

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
  __VUE_HMR_RUNTIME__.updateRoutes?.(routes)
  __VUE_HMR_RUNTIME__.updateRedirects?.(redirects)
}

if (import.meta.hot) {
  import.meta.hot.accept((m) => {
    __VUE_HMR_RUNTIME__.updateRoutes?.(m.routes)
    __VUE_HMR_RUNTIME__.updateRedirects?.(m.redirects)
  })
}
