AssemblyScript's Website
========================

The site is built with [VuePress](https://vuepress.vuejs.org/) and reuses its default theme to ease upgrading to newer versions.

The more important files are:

* [src/**/*.md](./src)<br />
  Documentation and site contents.
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
* [src/.vuepress/styles/index.styl](./src/.vuepress/styles/index.styl)<br />
  Additional styling rules.

Editor component
----------------

Markdown files can make use of a custom editor component using the `editor` language tag, like so:

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

* **optimize** = speed | size | none
* **noAssert**?
* **debug**?
* **runtime** = full | half | stub | none
* **noExportMemory**?
* **importMemory**?
* **exportTable**?
* **importTable**?
* **explicitStart**?
* **enable**? = sign-extension?,bulk-memory?,simd?,threads?,reference-types?

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

The page is automatically deployed on pushes to the repository, and at least once a day to sync sponsors.
