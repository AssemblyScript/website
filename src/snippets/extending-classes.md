---
description: Extending classes, object orientated programming snippet
---

# Extending Classes

Extending classes, and general Object Orientated Programming (OOP) in AssemblyScript


```editor
#!optimize=size&runtime=full

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
const jsLog = console.log;
function domConsoleLog() {
  let args = [...arguments];
  jsLog.apply(this, args);
  args.forEach(arg => {
    document.body.innerHTML += `<div>Log: ${args}</div>`;
  }); 
}
console.log = domConsoleLog;

loader.instantiate(module_wasm, { /* imports */ })
.then(({ exports }) => {
  console.log(`getStaticProp: ${exports.getStaticProp()}`);
  console.log(`overloadAdd: ${exports.overloadAdd(24)}`);
})
</script>

