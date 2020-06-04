---
description: An interface for working with a raw binary buffer.
---

# DataView

An interface for working with a raw binary buffer.

The DataView API is exactly as in JavaScript \([MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)\).

## Constructor

* ```ts
  new DataView(buffer: ArrayBuffer, byteOffset?: i32, byteLength?: i32)
  ```
  Constructs a new DataView on the specified buffer and region.

## Instance members

### Fields

* ```ts
  readonly buffer: ArrayBuffer
  ```
  The backing buffer.

* ```ts
  readonly byteLength: i32
  ```
  The length of this view from the start of its buffer.

* ```ts
  readonly byteOffset: i32
  ```
  The offset of this view from the start of its buffer.

### Methods

* ```ts
  function getFloat32(byteOffset: i32, littleEndian?: bool): f32
  ```
  Gets the 32-bit float value at the specified offset from the start of the view.

* ```ts
  function getFloat64(byteOffset: i32, littleEndian?: bool): f64
  ```
  Gets the 64-bit float value at the specified offset from the start of the view.

* ```ts
  function getInt8(byteOffset: i32): i8
  ```
  Gets the signed 8-bit integer value at the specified offset from the start of the view.

* ```ts
  function getInt16(byteOffset: i32, littleEndian?: bool): i16
  ```
  Gets the signed 16-bit integer value at the specified offset from the start of the view.

* ```ts
  function getInt32(byteOffset: i32, littleEndian?: bool): i32
  ```
  Gets the signed 32-bit integer value at the specified offset from the start of the view.

* ```ts
  function getInt64(byteOffset: i32, littleEndian?: bool): i64
  ```
  Gets the signed 64-bit integer value at the specified offset from the start of the view.

* ```ts
  function getUint8(byteOffset: i32, littleEndian?: bool): u8
  ```
  Gets the unsigned 8-bit integer value at the specified offset from the start of the view.

* ```ts
  function getUint16(byteOffset: i32, littleEndian?: bool): u16
  ```
  Gets the unsigned 16-bit integer value at the specified offset from the start of the view.

* ```ts
  function getUint32(byteOffset: i32, littleEndian?: bool): u32
  ```
  Gets the unsigned 32-bit integer value at the specified offset from the start of the view.

* ```ts
  function getUint64(byteOffset: i32, littleEndian?: bool): u64
  ```
  Gets the unsigned 64-bit integer value at the specified offset from the start of the view.

* ```ts
  function setFloat32(byteOffset: i32, value: f32, littleEndian?: bool): void
  ```
  Sets the 32-bit float value at the specified offset from the start of the view.

* ```ts
  function setFloat64(byteOffset: i32, value: f64, littleEndian?: bool): void
  ```
  Sets the 64-bit float value at the specified offset from the start of the view.

* ```ts
  function setInt8(byteOffset: i32, value: i8): void
  ```
  Sets the signed 8-bit integer value at the specified offset from the start of the view.

* ```ts
  function setInt16(byteOffset: i32, value: i16, littleEndian?: bool): void
  ```
  Sets the signed 16-bit integer value at the specified offset from the start of the view.

* ```ts
  function setInt32(byteOffset: i32, value: i32, littleEndian?: bool): void
  ```
  Sets the signed 32-bit integer value at the specified offset from the start of the view.

* ```ts
  function setInt64(byteOffset: i32, value: i64, littleEndian?: bool): void
  ```
  Sets the signed 64-bit integer value at the specified offset from the start of the view.

* ```ts
  function setUint8(byteOffset: i32, value: u8, littleEndian?: bool): void
  ```
  Sets the unsigned 8-bit integer value at the specified offset from the start of the view.

* ```ts
  function setUint16(byteOffset: i32, value: u16, littleEndian?: bool): void
  ```
  Sets the unsigned 16-bit integer value at the specified offset from the start of the view.

* ```ts
  function setUint32(byteOffset: i32, value: u32, littleEndian?: bool): void
  ```
  Sets the unsigned 32-bit integer value at the specified offset from the start of the view.

* ```ts
  function setUint64(byteOffset: i32, value: u64, littleEndian?: bool): void
  ```
  Sets the unsigned 64-bit integer value at the specified offset from the start of the view.

* ```ts
  function toString(): string
  ```
  Returns a string representation of this object.

Endianness defaults to `littleEndian = false`.
