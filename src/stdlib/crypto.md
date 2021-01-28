---
description: Crypto implementation on top of WASI.
---

# crypto

An implementation of the `crypto` global on top of WASI. Requires a WASI-enabled host and opting into WASI in the entry file with

```ts
import "wasi";
```

## Static members

* ```ts
  function getRandomValues(array: Uint8Array): void
  ```
  Fills `array` with cryptographically strong random values.
