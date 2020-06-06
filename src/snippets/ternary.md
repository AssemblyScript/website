---
description: Ternary Snippet
---

# Ternary

Using Ternary in AssemblyScript

```editor
#!optimize=size&runtime=full
export function isTrue(a: i32): i32 {
  let response = a > 0 ? 1 : 0;
  return response;
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
  console.log(`is 24 greater than 0? ${exports.isTrue(24) > 0 ? true : false}`);
  console.log(`is -3 greater than 0? ${exports.isTrue(-3) > 0 ? true : false}`);
});
</script>
```

