# Arrays example

Shows how to exchange and work with arrays either created in WebAssembly or in JavaScript.

## Contents

* Using the loader and the full runtime to work with managed objects.
* Creating arrays in WebAssembly and using them in JavaScript.
* Creating arrays in JavaScript and using them in WebAssembly.
* Using both copies of and live views on arrays.
* Performing `unchecked` accesses where the length of an array is known.
* Pinning objects externally to prevent premature garbage collection.

## Example

```editor
#!optimize=speed&runtime=default&exportRuntime
/** Creates a new array and returns it to JavaScript. */
export function createArray(length: i32): Int32Array {
  return new Int32Array(length)
}

/** Randomizes the specified array's values. */
export function randomizeArray(arr: Int32Array): void {
  for (let i = 0, k = arr.length; i < k; ++i) {
    let value = i32((Math.random() * 2.0 - 1.0) * i32.MAX_VALUE)
    unchecked(arr[i] = value)
  }
}

/** Computes the sum of an array's values and returns the sum to JavaScript. */
export function sumArray(arr: Int32Array): i32 {
  let total = 0
  for (let i = 0, k = arr.length; i < k; ++i) {
    total += unchecked(arr[i])
  }
  return total
}

// We'll need the unique Int32Array id when allocating one in JavaScript
export const Int32Array_ID = idof<Int32Array>()

#!html
<textarea id="output" style="width: 100%; height: 100%" readonly></textarea>
<script>
loader.instantiate(module_wasm).then(({ exports }) => {
  const output = document.getElementById('output')

  /** Logs a message to the textarea. */
  function log(message = '') {
    output.value += `${message}\n`
  }

  // A simple example using an array created in WebAssembly.
  function example1() {
    log('=== Example1 ===')

    // Obtain the necessary runtime helpers
    const { __pin, __unpin, __getArray } = exports

    // Create a new array in WebAssembly and get a reference to it. Note that
    // the array is not reachable from within WebAssembly, only externally, so
    // we should pin it to prevent it from becoming garbage collected too early.
    let arrayPtr = __pin(exports.createArray(5))
    log(`Array pointer: ${arrayPtr}`)

    // Log its elements to make sure these are zero
    log('Initial values: ' + __getArray(arrayPtr).join(', '))

    // Randomize the array in WebAssembly and log it again
    exports.randomizeArray(arrayPtr)
    log('Randomized values: ' + __getArray(arrayPtr).join(', '))

    // Compute the array values' sum and log it. This will overflow i32 range.
    let total = exports.sumArray(arrayPtr)
    log(`Sum (likely overflown): ${total}`)

    // We are done with the array, so __unpin it so it can become collected.
    __unpin(arrayPtr)

    log()
  }
  example1()

  // A slightly more advanced example allocating the array in JavaScript instead
  // of WebAssembly, and utilizing a live view to modify it in WebAssembly memory.
  function example2() {
    log('=== Example2 ===')

    // Obtain the necessary runtime helpers
    const { __pin, __unpin, __newArray, __getArray, __getArrayView } = exports

    // Create a new array, but this time in JavaScript. Note that the array is
    // again not reachable from within WebAssembly, only externally, so we
    // should pin it to prevent it from becoming garbage collected too early.
    let arrayPtr = __pin(__newArray(exports.Int32Array_ID, [
      3, 4, 5, 6, 7, 8, 9
    ]))
    log('Array pointer: ' + arrayPtr)

    // Log its elements to make sure these are the provided values
    log('Initial values: ' + __getArray(arrayPtr).join(', '))

    // Compute the array values' sum and log it
    let total = exports.sumArray(arrayPtr)
    log('Sum: ' + total)

    // Instead of copying, let's obtain a live view on the array and modify its
    // values right in WebAssembly memory.
    let view = __getArrayView(arrayPtr)
    view.reverse()

    // Log the array's elements, now reversed
    log('Reversed values: ' + __getArray(arrayPtr).join(', '))

    // We are done with the array, so __unpin it so it can become collected.
    __unpin(arrayPtr)

    log()
  }
  example2()
})
</script>
```

::: tip NOTE
This example utilizes the loader to work with managed objects, hence requires `--exportRuntime` to be set to expose the runtime helpers to JavaScript.
:::

## Resources

Further information on using the loader and the runtime helpers is available as part of the [loader's](../loader.md#counting-references) and the [garbage collection documentation](../garbage-collection.md).
