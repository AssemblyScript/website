---
description: Extending classes, object orientated programming snippet
---

# Extending Classes

Extending classes, and general Object Orientated Programming (OOP) in AssemblyScript


```editor
#!runtime=full

class BaseClass {
  static staticProp: i32 = 24;
  instanceProp: i32;

  constructor(value: i32) {
    this.instanceProp = value;
  }

  add(a: i32, b: i32): i32 {
    return a + b;
  }
}

class ExtendedClass extends BaseClass {

  extendedProp: i32;

  constructor(extendedValue: i32) {
    super(1);

    this.extendedProp = extendedValue;
  }

  add(a: i32): i32 {
    return super.add(a, this.extendedProp + super.instanceProp);
  }
}

export function getStaticProp(): i32 {
  return ExtendedClass.staticProp;
}

export function overloadAdd(value: i32): i32 {
  let extendedClass = new ExtendedClass(value);
  return extendedClass.add(24);
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
  console.log(`getStaticProp: ${exports.getStaticProp()}`);
  console.log(`overloadAdd: ${exports.overloadAdd(24)}`);
})
</script>

