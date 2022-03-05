# console

An implementation of the `console` global. Works with generated [host bindings](../compiler.md#host-bindings) or when [targeting WASI](../concepts.md#targeting-wasi).

## Static members

* ```ts
  function assert<T>(assertion: T, message?: string): void
  ```
  Logs `message` to console if `assertion` is false-ish.

* ```ts
  function log(message?: string): void
  ```
  Outputs `message` to the console.

* ```ts
  function debug(message?: string): void
  function info(message?: string): void
  function warn(message?: string): void
  function error(message?: string): void
  ```
  Outputs `message` to the console, prefixed with "Debug:", "Info:", "Warning:" or "Error:" respectively.

* ```ts
  function time(label?: string): void
  ```
  Starts a new timer using the specified `label`.

* ```ts
  function timeLog(label?: string): void
  ```
  Logs the current value of a timer previously started with `console.time`.

* ```ts
  function timeEnd(label?: string): void
  ```
  Logs the current value of a timer previously started with `console.time` and discards the timer.
