---
description: Instructions for setting up a development environment.
---

# Development

Instructions for setting up a development environment.

::: tip
Please see our [contribution guidelines](https://github.com/AssemblyScript/assemblyscript/blob/master/CONTRIBUTING.md) before submitting your first pull request.
:::

## Setting up a development environment

The following sets up a development environment of the compiler where editing the sources applies changes immediately without having to go through a build step:

```sh
git clone https://github.com/AssemblyScript/assemblyscript.git
cd assemblyscript
npm install
npm link
```

Note that a development environment runs the sources directly by default, but will use distributions files once built. Cleaning the distribution files again with `npm run clean` resets this. Whether `asc` is running the sources or distribution files can be determined by checking the displayed version number. If it states `-dev`, it runs the sources directly.

## Building distribution files

To build an UMD bundle to `dist/assemblyscript.js` \(depends on [binaryen.js](https://github.com/AssemblyScript/binaryen.js)\), including a browser version of asc to `dist/asc.js` \(depends on assemblyscript.js\):

```sh
npm run build
```

Cleaning the distribution files \(again\):

```sh
npm run clean
```

Linting potential changes:

```sh
npm run check
```

 Running the [tests](https://github.com/AssemblyScript/assemblyscript/blob/master/tests):

```sh
npm test
```

Running everything in order \(check, clean, test, build, test\):

```sh
npm run all
```

## Creating tests

The test suite is composed of a set of tests for each component, like the parser, the compiler and runtime. For each pull request, all the tests are run automatically and the PR only goes green if it passes all of them. Please see the [instructions within the repository](https://github.com/AssemblyScript/assemblyscript/tree/master/tests) for all the details.
