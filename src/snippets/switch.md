---
description: Switch Statement Snippet
---

# Switch

Using `switch` statements in AssemblyScript.

**NOTE:** Switch conditions currently implicitly convert to u32, i.e. switching over strings or similar is not yet supported. If using i32s, a more technical detail would be that using values greater than or equal to zero has better codegen, because br_tables are unsigned, so a -1 for example would not tablify well with otherwise positive values (it does work, though, but code is not optimal).

```editor
#!runtime=half
export function switchSurprise(a: i32): i32 {
  let response = -1;

  // Using a mix of braces and not using braces
  // To show both syntaxes are supported here.
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
  }
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

