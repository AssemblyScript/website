---
description: How to hook into the compilation process with compiler transforms.
---

# Transforms

AssemblyScript is compiled statically, so code transformation cannot be done at runtime but must instead be performed at compile-time. To enable this, the compiler frontend \(asc\) provides a mechanism to hook into the compilation process before, while and after the module is being compiled.

Specifying `--transform ./myTransform` on the command line will load the node module pointed to by `./myTransform`.

```js
const { Transform } = require("assemblyscript/cli/transform")
const assemblyscript = require("assemblyscript")
class MyTransform extends Transform {
  ...
}
module.exports = MyTransform
```

## Properties

A transform is an ES6 class/node module with the following inherited properties:

* ```ts
  readonly program: Program
  ```
  Reference to the `Program` instance.

* ```ts
  readonly baseDir: string
  ```
  Base directory used by the compiler.

* ```ts
  readonly stdout: OutputStream
  ```
  Output stream used by the compiler.

* ```ts
  readonly stderr: OutputStream
  ```
  Error stream uses by the compiler.

* ```ts
  readonly log: typeof console.log
  ```
  Logs a message to console.

* ```ts
  function writeFile(filename: string, contents: string | Uint8Array, baseDir: string): boolean
  ```
  Writes a file to disk.

* ```ts
  function readFile(filename: string, baseDir: string): string | null
  ```
  Reads a file from disk.

* ```ts
  function listFiles(dirname: string, baseDir: string): string[] | null
  ```
  Lists all files in a directory.

## Hooks

The frontend will call several hooks, if present on the transform, during the compilation process:

* ```ts
  function afterParse(parser: Parser): void
  ```
  Called when parsing is complete, before a program is initialized from the AST. Note that types are not yet known at this stage and there is no easy way to obtain them.

* ```ts
  function afterInitialize(program: Program): void
  ```
  Called once the program is initialized, before it is being compiled. Types are known at this stage, respectively can be resolved where necessary.

* ```ts
  function afterCompile(module: Module): void
  ```
  Called with the resulting module before it is being emitted. Useful to modify the IR before writing any output, for example to replace imports with actual functionality or to add custom sections.

Transforms are a very powerful feature, but may require profound knowledge of the compiler to utilize them to their full extend, so reading through the compiler sources is a plus.
