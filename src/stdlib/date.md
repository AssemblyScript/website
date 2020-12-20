---
description: Represents timestamps.
---

# Date

Represents timestamps.

The Date API is still preliminary and requires importing the `Date` object from the host \(as `Date`\).

## Constructor

* ```ts
  new Date(value: i64)
  ```
  Constructs a new date object from an UTC timestamp in milliseconds.

## Static members

* ```ts
  function now(): i64
  ```
  Returns the current UTC timestamp in milliseconds.

* ```ts
  function UTC(
    year: i32,
    month?: i32,
    day?: i32,
    hour?: i32,
    minute?: i32,
    second?: i32,
    millisecond?: i64
  ): i64
  ```
  Returns the UTC timestamp in milliseconds of the specified date.

## Instance members

* ```ts
  function getTime(): i64
  ```
  Gets the UTC timestamp of this date in milliseconds.

* ```ts
  function setTime(value: i64): i64
  ```
  Sets the UTC timestamp of this date in milliseconds and returns the timestamp.
