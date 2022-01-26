
# Getting started

Paving the way to your first AssemblyScript module.

## Setting up a new project

Make sure that a [recent version of Node.js](https://nodejs.org) and its package manager **npm** \(comes with Node.js\) are installed, then switch to a new directory and initialize a new Node.js module as usual:

```sh
npm init
```

Install the AssemblyScript compiler. Let's assume that it is not required in production and make it a development dependency:

```sh
npm install --save-dev assemblyscript
```

Once installed, the compiler provides a handy scaffolding utility to quickly set up a new project, here in the current directory:

```sh
npx asinit .
```

It automatically creates the recommended directory structure and configuration files:

```
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
```

## Working with your module

The example in `assembly/index.ts` can now be compiled to WebAssembly by invoking the build command:

```sh
npm run asbuild
```

Doing so will emit the compiled binary and definition files to the `build/` directory.

The generated test case in `tests/index.js` can be executed with:

```sh
npm test
```

Via the generated `index.js` (loads the WebAssembly binary), the module can be imported like a normal Node.js module:

```js
import myModule from "path/to/myModule";
myModule.add(1, 2);
```

Likewise, the generated `index.html` shows how the module can be used on the Web.

## The journey ahead

So far, so good! Now it is time to start editing the project of course, which typically involves:

* Editing and adding source files within the `assembly/` directory and updating the tests in `tests/`.

* Editing the generated `index.js` to wire up [imports and exports](./exports-and-imports.md#imports) between WebAssembly and the outside world.

* Tweaking [compiler options](./compiler.md) in [`asconfig.json`](./compiler.md#asconfig-json) to fit your project's needs.

* Realizing that AssemblyScript is not quite TypeScript and that WebAssembly still has a way to go 🙂

But that's it already for a quick start. Read on to [learn more](/basics.md)!
