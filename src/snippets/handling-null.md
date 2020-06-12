---
description: Using and Handling Null snippet
---

# Handling Null

Handling Null as a union type for optional return values, and simulating try/catch for errors in AssemblyScript

```editor
#!optimize=size&runtime=full
class MyValue {
  value: i32;

  constructor(value: i32) {
    this.value = value;
  }
}

// Using a class type here, as some types are not nullable
function getMyValue(isAble: boolean): MyValue | null {
  let myValue = new MyValue(24);
  if (isAble) {
    return myValue;
  } else {
    return null;
  }
}

export function positiveAddWithMyValue(a: i32): i32 {
  let myValue = getMyValue(a > 0);
  if (myValue == null) {
    return -1;
  } else {
    return a + myValue.value;
  }
}

#!html
<script>
const log = console.log;
console.log = (...args) => {
  log(...args);
  let str = '';
  args.forEach(arg => {
    if (typeof arg == 'object') {
      str += `${JSON.stringify(arg, null, 2)}<br/>`;
    } else {
      str += `${arg}<br/>`;
    }
  }
  document.body.innerHTML += `<div>Log: ${str}</div>`;
}

loader.instantiate(module_wasm, { /* imports */ })
.then(({ exports }) => {
  if(exports.positiveAddWithMyValue(24) > -1) {
    console.log("Add was successful")
  } else {
    console.log("Could not add 24");
  }

  if(exports.positiveAddWithMyValue(-1) > -1) {
  console.log("Add was successful")
  } else {
  console.log("Could not add -1");
  }
});
</script>
```

