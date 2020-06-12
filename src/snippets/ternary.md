---
description: Ternary Snippet
---

# Ternary

Using Ternary in AssemblyScript

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
  }
  document.body.innerHTML += `<div>Log: ${str}</div>`;
}

loader.instantiate(module_wasm, { /* imports */ })
.then(({ exports }) => {
  console.log(`is 24 greater than 0? ${exports.isTrue(24) > 0 ? true : false}`);
  console.log(`is -3 greater than 0? ${exports.isTrue(-3) > 0 ? true : false}`);
});
</script>
```

