---
description: Class / Classes Snippet
---

# Class

A snippet on using Classes in AssemblyScript, and assigning instance vs. static properties.

```editor
#!runtime=full
class Animal<T> {
  static ONE: i32 = 1;
  static add(a: i32, b: i32): i32 { return a + b + Animal.ONE; }

  two: i16 = 2; // 6
  instanceSub<T>(a: T, b: T): T { return a - b + <T>Animal.ONE; } // tsc does not allow this
}

export function staticOne(): i32 {
  return Animal.ONE;
}

export function staticAdd(a: i32, b: i32): i32 {
  return Animal.add(a, b);
}

export function instanceTwo(): i32 {
  let animal = new Animal<i32>();
  return animal.two;
}

export function instanceSub(a: f32, b: f32): f32 {
  let animal = new Animal<f32>();
  return animal.instanceSub<f32>(a, b);
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
    console.log(exports.staticOne());
    console.log(exports.staticAdd(1, 2));
    console.log(exports.instanceTwo());
    console.log(exports.instanceSub(3.0, 1.0));
  })
</script>
```
