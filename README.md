AssemblyScript's Website
========================

![Deploy](https://github.com/AssemblyScript/website/workflows/Deploy/badge.svg?branch=main)

The site is built with [VuePress](https://vuepress.vuejs.org/) and reuses its default theme to ease upgrading to newer versions.

The more important files are:

* [src/**/*.md](./src)<br />
  Documentation and site contents, i.e. what one would typically modify when extending the documentation.
* [src/.vuepress/sidebar.js](./src/.vuepress/sidebar.js)<br />
  Sidebar contents.
* [src/.vuepress/nav.js](./src/.vuepress/nav.js)<br />
  Top-navigation contents.
* [src/.vuepress/redirects](./src/.vuepress/redirects)<br />
  Redirect map of (re)moved pages to new locations.
* [src/.vuepress/public/](./src/.vuepress/public)<br />
  Assets folder for images etc.
* [src/.vuepress/public/sponsors](./src/.vuepress/public/sponsors)<br />
  Sponsor logo overrides (file name is collective name).

Editor component
----------------

Markdown files can make use of a custom [editor component](./src/.vuepress/public/editor.html) using the `editor` language tag, like so:

````
```editor
#!optimize=size&runtime=none&noAssert&explicitStart&enable=simd,reference-types
export function add(a: i32, b: i32): i32 {
  return a + b
}

#!html
<script>
loader.instantiate(module_wasm, { /* imports */ })
  .then(({ exports }) => {
    console.log(exports.add(1, 2))
  })
</script>
```
````

The first line is an optional shebang indicating selected compiler options. Available options are:

* **optimize** = `string`<br />
  Optimization preset to use. Valid presets are `speed`, `size` and `none`
* **noAssert**<br />
  Replaces assertions with just their value without trapping.
* **debug**<br />
  Enables debug information in emitted binaries.
* **runtime** = `string`<br />
  Specifies the runtime variant to include in the program. Valid variants are `full`, `half`, `stub` and `none`.
* **noExportMemory**<br />
  Does not export the memory to the host.
* **importMemory**<br />
  Imports the memory from the host.
* **exportTable**<br />
  Exports the function table to the host.
* **importTable**<br />
  Imports the function table from the host.
* **explicitStart**<br />
  Exports an explicit start function to call.
* **memoryBase** = `integer`<br />
  Sets the start offset of emitted memory segments.
* **tableBase** = `integer`<br />
  Sets the start offset of emitted table elements.
* **use** = `string`<br />
  Comma separated list of global aliases, e.g. to switch the default 'Math' implementation used: `Math=JSMath`
* **enable** = `string`<br />
  Comma-separated list of future WebAssembly features to enable. Valid features are `sign-extension`, `bulk-memory`, `simd`, `threads` and `reference-types`.

The current source and associated compiler options can be serialized into a base64 blob this way. For example, when the 🔗 button is clicked, `document.location.hash` is updated with that blob and the then-sharable link is copied to clipboard.

Building
--------

To work on the site locally, install the dependencies and start a development server serving at [localhost:8080](http://localhost:8080/):

```sh
npm install
npm start
```

To build the site to `dist`, i.e. to verify that it works as expected:

```sh
npm run build
```

Distribution files can also be served instead of using the development server with:

```sh
npm run serve
```

The page is automatically deployed on pushes to the repository, plus at least once a day to sync contributors and sponsors.
