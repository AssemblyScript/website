# crypto

An implementation of the `crypto` global. Works with generated [host bindings](../compiler.md#host-bindings) or when [targeting WASI](../concepts.md#targeting-wasi).

## Static members

* ```ts
  function getRandomValues(array: Uint8Array): void
  ```
  Fills `array` with cryptographically strong random values.
