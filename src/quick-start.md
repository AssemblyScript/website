---
description: Paving the way to what might be your first AssemblyScript module.
sidebarDepth: 0
---

# Quick Start

Paving the way to what might be your first AssemblyScript module.

## Prerequisites

The following assumes that a [recent version of Node.js](https://nodejs.org) and its package manager [npm](https://www.npmjs.com) \(comes with Node.js\) are installed, with the commands below executed in a command prompt. Basic knowledge about writing and working with TypeScript modules, which is very similar, is a plus.

## Setting up a new project

To get started with AssemblyScript, switch to a new directory and initialize a new node module:

```sh
npm init
```

Now install both the [loader](./loader.md) and the [compiler](./compiler.md) using npm. Let's assume that the compiler is not required in production and make it a development dependency:

```sh
npm install --save @assemblyscript/loader
npm install --save-dev assemblyscript
```

::: tip
If you need a [specific version](https://github.com/AssemblyScript/assemblyscript/releases) of the loader and/or the compiler, append the respective version number as usual.
:::

Once installed, the compiler provides a handy scaffolding utility to quickly set up a new AssemblyScript project, for example in the directory of the just initialized node module:

```sh
npx asinit .
```

It automatically creates the recommended directory structure and configuration files:

```
This command will make sure that the following files exist in the project
directory '/path/to/mymodule':

  ./assembly
  Directory holding the AssemblyScript sources being compiled to WebAssembly.

  ./assembly/tsconfig.json
  TypeScript configuration inheriting recommended AssemblyScript settings.

  ./assembly/index.ts
  Example entry file being compiled to WebAssembly to get you started.

  ./build
  Build artifact directory where compiled WebAssembly files are stored.

  ./build/.gitignore
  Git configuration that excludes compiled binaries from source control.

  ./index.js
  Main file loading the WebAssembly module and exporting its exports.

  ./tests/index.js
  Example test to check that your module is indeed working.

  ./asconfig.json
  Configuration file defining both a 'debug' and a 'release' target.

  ./package.json
  Package info containing the necessary commands to compile to WebAssembly.

Do you want to proceed? [Y/n]
```

Once initialized, edit the sources in `assembly/`, tweak [compiler options](./compiler.md) in `asconfig.json` to fit your needs, and run the build command to compile your module to WebAssembly:

```sh
npm run asbuild
```

## Next steps

Once compiled, you may run the tests in `tests/index.js`:

```sh
npm test
```

add [imports](./exports-and-imports.md#imports) to the generated `index.js` (instantiates the module and re-exports it):

```js
...
const imports = {
  "assembly/index": {
    declarredImportedFunction: function(...) { ... }
  }
};
...
```

and ultimately use your WebAssembly module like a normal node module:

```js
const myModule = require("path/to/mymodule");
myModule.add(1, 2);
```

::: tip NOTE
Your module's exports only understand integers and floats for now, with strings and objects being passed as pointers, but we'll get into that later when covering the [loader](/loader.md).
:::

Read on to [learn more](/basics.md)!
