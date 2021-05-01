---
description: Represents timestamps.
---

# Date

Represents timestamps.

The Date API is still preliminary with only a subset of properties and methods implemented. Note that getting the current date, via `Date.now`, requires importing the `Date` object from the host \(as `Date`\).

::: warning
  Date does not currently support timezones other than UTC. Therefore, methods such as `toString` and `toTimeString` can only be partially implemented.
:::

## Constructor

* ```ts
  new Date(value: i64)
  ```
  Constructs a new date object from an UTC timestamp in milliseconds.

## Static members

* ```ts
  function now(): i64
  ```
  Returns the current UTC timestamp in milliseconds. To use this function you must import the `Date` object from the host \(as `Date`\).

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

* ```ts
  function parse(dateString: string): Date
  ```
  Parses a Date object from a string (ISO 8601 format only).

* ```ts
  function fromString(dateTimeString: string): Date
  ```
  Creates a Date object from an ISO 8601 formatted string.

## Instance members

* ```ts
  function getTime(): i64
  ```
  Gets the UTC timestamp of this date in milliseconds.

* ```ts
  function setTime(value: i64): i64
  ```
  Sets the UTC timestamp of this date in milliseconds and returns the timestamp.

* ```ts
  function getUTCFullYear(): i32
  ```
  Gets the full year according to universal time.

* ```ts
  function setUTCFullYear(value: i32): i32
  ```
  Sets the full year according to universal time.

* ```ts
  function getUTCMonth(): i32
  ```
  Gets the (zero indexed) month according to universal time.

* ```ts
  function setUTCMonth(value: i32): i32
  ```
  Sets the (zero indexed) month according to universal time.

* ```ts
  function getUTCDate(): i32
  ```
  Gets the day of the month according to universal time.

* ```ts
  function setUTCDate(value: i32): i32
  ```
  Sets the day of the month according to universal time.

* ```ts
  function getUTCDay(): i32
  ```
  Gets the day of the week in the specified date according to universal time, where 0 represents Sunday.

* ```ts
  function getUTCHours(): i32
  ```
  Gets the hour according to universal time.

* ```ts
  function setUTCHours(value: i32): i32
  ```
  Sets the hour according to universal time.

* ```ts
  function getUTCMinutes(): i32
  ```
  Gets the minute according to universal time.

* ```ts
  function setUTCMinutes(value: i32): i32
  ```
  Sets the minute according to universal time.

* ```ts
  function getUTCSeconds(): i32
  ```
  Gets the second according to universal time.

* ```ts
  function setUTCSeconds(value: i32): i32
  ```
  Sets the second according to universal time.

* ```ts
  function getUTCMilliseconds(): i32
  ```
  Gets the millisecond according to universal time.

* ```ts
  function setUTCMilliseconds(value: i32): i32
  ```
  Sets the millisecond according to universal time.

* ```ts
  function toISOString(): string
  ```
  Returns the a string in simplified extended ISO 8601 format.

* ```ts
  function toUTCString(): string
  ```
  Returns the a string in RFC-1123 format and the UTC time zone.

* ```ts
  function toDateString(): string
  ```
  Returns the a date string in human readable form in English WWW MMM DD YYYY format.

* ```ts
  function toTimeString(): string
  ```
  Returns the a time string in HH:MM:SS format.

::: warning
At the moment `toTimeString` doesn't output time zone and doesn't use local time zone offset!
:::

* ```ts
  function toString(): string
  ```
  Returns the a time string in human readable form in English WWW MMM DD YYYY HH:MM:SS format.

::: warning
At the moment `toString` doesn't output time zone and doesn't use local time zone offset!
:::
