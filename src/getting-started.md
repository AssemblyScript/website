
# Getting started

Paving the way to your first AssemblyScript module.

## Setting up a new project

Make sure that a [recent version of Node.js](https://nodejs.org) and its package manager **npm** \(that comes with Node.js\) are installed, then switch to a new directory and initialize a new Node.js module as usual:

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

The `asinit` command automatically creates the recommended directory structure and configuration files:

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

  ./asconfig.json
  Configuration file defining both a 'debug' and a 'release' target.

  ./package.json
  Package info containing the necessary commands to compile to WebAssembly.

  ./tests/index.js
  Stater test to check that the module is functioning.

  ./index.html
  Starter HTML file that loads the module in a browser.
```

For completeness, `asinit` supports the following options:

```
Sets up a new AssemblyScript project or updates an existing one.

SYNTAX
  asinit directory [options]

EXAMPLES
  asinit .
  asinit ./newProject -y

OPTIONS
  --help, -h            Prints this help message.
  --yes, -y             Answers all questions with their default option
                        for non-interactive usage.
```

## Working with your module

The example in `assembly/index.ts` can now be compiled to WebAssembly by invoking the build command:

```sh
npm run asbuild
```

Doing so will emit the compiled binaries, bindings and definition files to the `build/` directory.

The generated test case in `tests/index.js` can be executed with:

```sh
npm test
```

Once built, the directory contains all the bits to use the module like any other modern Node.js
ESM module:

```js
import * as myModule from "myModule";
```

The generated `index.html` shows how the module can be used on the Web. A web server serving
the module directory, defaulting to display `index.html`, can be started with:

```sh
npm start
```

Note that not all of the files may be required depending on the use case, and it is safe
to delete what's not needed. If anything goes wrong, `asinit` can be executed again, then
restoring the deleted default files while keeping already edited ones.

## The journey ahead

So far, so good! Now it is time to start editing the project of course, which typically involves:

* Editing and adding source files within the `assembly/` directory and updating the tests in `tests/`.

* Tweaking [compiler options](./compiler.md#compiler-options) in [`asconfig.json`](./compiler.md#configuration-file) to fit your project's needs.

* Realizing that WebAssembly still has a ways to go 🙂

But that's it already for a quick start. Read on to [learn more](/compiler.md)!
