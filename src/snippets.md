# Snippets

Snippets are small, copy-pastable AssemblyScript examples meant to show off common syntax and patterns when writing AssemblyScript.

## Class

An AssemblyScript snippet on using Classes, their instantiation, and their static properties.

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
  });
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

## Extending Classes

Extending classes and general Object Orientated Programming (OOP) in AssemblyScript

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
  });
  document.body.innerHTML += `<div>Log: ${str}</div>`;
}

loader.instantiate(module_wasm, { /* imports */ })
.then(({ exports }) => {
  console.log(`getStaticProp: ${exports.getStaticProp()}`);
  console.log(`overloadAdd: ${exports.overloadAdd(24)}`);
})
</script>
```

## Handling Null

Handling Null as a union type for optional return values and simulating `try/catch` for errors in AssemblyScript

```editor
#!runtime=full
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
  });
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

## Switch Case

Using `switch case` statements in AssemblyScript.

**NOTE:** Switch conditions currently implicitly convert to u32, i.e. switching over strings or similar is not yet supported. If using i32s, a more technical detail would be that using values greater than or equal to zero has better codegen, because br_tables are unsigned, so a -1 for example would not tablify well with otherwise positive values (it does work, though, but code is not optimal).

```editor
#!runtime=half
export function switchSurprise(a: i32): i32 {
  let response = -1;

  // Using a mix of braces and not using braces
  // to show that both syntaxes are supported here.
  switch (a) {
    case 1:
      response = 100;
      break;
    // Cases can also use braces
    case 2: {
      response = 200;
      break;
    }
    case 3:
      // Fall Through to the next case
    case 4:
      response = 400;
      break;
    default: {
      response = 0;
    }
  }

  return response;
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
  });
  document.body.innerHTML += `<div>Log: ${str}</div>`;
}

loader.instantiate(module_wasm, { /* imports */ })
.then(({ exports }) => {
  console.log(`switchSurprise(1) : ${exports.switchSurprise(1)}`);
  console.log(`switchSurprise(2) : ${exports.switchSurprise(2)}`);
  console.log(`switchSurprise(3) : ${exports.switchSurprise(3)}`);
  console.log(`switchSurprise(4) : ${exports.switchSurprise(4)}`);
  console.log(`switchSurprise(57) : ${exports.switchSurprise(57)}`);
});
</script>
```

## Ternary if-else

Using Ternary if-else in AssemblyScript

```editor
#!runtime=half
export function isTrue(a: i32): i32 {
  let response = a > 0 ? 1 : 0;
  return response;
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
  });
  document.body.innerHTML += `<div>Log: ${str}</div>`;
}

loader.instantiate(module_wasm, { /* imports */ })
.then(({ exports }) => {
  console.log(`is 24 greater than 0? ${exports.isTrue(24) > 0 ? true : false}`);
  console.log(`is -3 greater than 0? ${exports.isTrue(-3) > 0 ? true : false}`);
});
</script>
```
