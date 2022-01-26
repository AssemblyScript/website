# process

An implementation of a Node.js-like `process` global. Due to the lack of an alternative, this API requires a WASI-enabled host or polyfill, then opting into WASI in the entry file with

```ts
import "wasi";
```

## Static members

* ```ts
  const arch: string
  ```
  String representing the CPU architecture for which the binary was compiled. Either `wasm32` or `wasm64`.

* ```ts
  const platform: string
  ```
  String representing the operating system platform for which the binary was compiled. Always `wasm`.

* ```ts
  const argv: string[]
  ```
  Array of command line arguments passed to the binary upon instantiation.

* ```ts
  const env: Map<string,string>
  ```
  Map of variables in the binary's user environment.

* ```ts
  var exitCode: i32
  ```
  Process exit code to use when the process exits gracefully. Defaults to `0`.

* ```ts
  function exit(code?: i32): void
  ```
  Terminates the process with either the given exit code, or `process.exitCode` if omitted.

* ```ts
  const stdin: ReadableStream
  const stdout: WritableStream
  const stderr: WritableStream
  ```
  Streams connected to `stdin` (fd `0`), `stdout` (fd `1`) and `stderr` (fd `2`) respectively.

* ```ts
  function time(): i64
  ```
  Obtains the system's current time of day, in milliseconds since Unix epoch.

* ```ts
  function hrtime(): u64
  ```
  Obtains the system's monotonic high resolution time, in nanoseconds since an arbitrary time in the past.
