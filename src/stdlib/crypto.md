# crypto

An implementation of the `crypto` global. Due to the lack of an alternative, this API requires a WASI-enabled host or polyfill, then opting into WASI in the entry file with

```ts
import "wasi";
```

## Static members

* ```ts
  function getRandomValues(array: Uint8Array): void
  ```
  Fills `array` with cryptographically strong random values.
