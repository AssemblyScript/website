---
description: Switch Statement Snippet
---

# Switch

Using `switch` statements in AssemblyScript

```editor
#!optimize=size&runtime=full
export function switchSurprise(a: i32): i32 {
  let response = -1;
  switch(a) {
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
  console.log(`switchSurprise(1) : ${exports.switchSurprise(1)}`);
  console.log(`switchSurprise(2) : ${exports.switchSurprise(2)}`);
  console.log(`switchSurprise(3) : ${exports.switchSurprise(3)}`);
  console.log(`switchSurprise(4) : ${exports.switchSurprise(4)}`);
  console.log(`switchSurprise(57) : ${exports.switchSurprise(57)}`);
});
</script>
```

