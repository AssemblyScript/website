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
If you need a [specific version](https://github.com/AssemblyScript/assemblyscript/releases) of the loader and/or the compiler, append the respective version number as usual. The latest nightly version \(note the `--save-exact`\) can be obtained via

```sh
npm install --save --save-exact @assemblyscript/loader@nightly  
npm install --save-dev --save-exact assemblyscript@nightly
```
:::

Once installed, the compiler provides a handy scaffolding utility to quickly set up a new AssemblyScript project, for example in the directory of the just initialized node module:

```sh
npx asinit .
```

It automatically creates the recommended directory structure and configuration files, including:

* The `assembly/` directory containing the sources being compiled to WebAssembly, with a `tsconfig.json` telling your editor about AssemblyScript's standard library and an `index.ts` to get you started.
* The `build/` directory where compiled WebAssembly binaries, source maps, definition files etc. become placed.
* A `package.json` with the necessary dependencies and build tasks to compile both an untouched \(as emitted by the AssemblyScript compiler\) and an optimized \(using Binaryen\) version of your program in both binary and text format.

Once initialized, edit the sources in `assembly/`, maybe tweak the build steps in `package.json` to fit your needs, and run the build command to compile your module to WebAssembly:

```sh
npm run asbuild
```

## Next steps

Using `index.js` in the root directory of your package to instantiate and export the WebAssembly module you'll then be able to `require`it just like any other node module, with the notable difference that the only values your module's exports understand being integers and floats. Read on to learn more!
