# Editor Test

Text before

```editor
#!runtime=half
// Editor A

export function add(a: i32, b: i32): i32 {
  return a + b
}

export function sub(a: i32, b: i32): i32 {
  return a - b
}

#!html
<script>
loader.instantiate(module_wasm, { /* imports */ })
  .then(({ exports }) => {
    const output = document.getElementById('output')
    output.value += `add(1, 2) = ${exports.add(1, 2)}\n`
    output.value += `sub(1, 2) = ${exports.sub(1, 2)}\n`
  })
</script>

<textarea id="output" style="height: 100%; width: 100%" readonly></textarea>
```

Text between

```editor
#!runtime=half
// Editor B

export function sub(a: i32, b: i32): i32 {
  return a - b
}

export function add(a: i32, b: i32): i32 {
  return a + b
}

#!html
<script>
loader.instantiate(module_wasm, { /* imports */ })
  .then(({ exports }) => {
    const output = document.getElementById('output')
    output.value += `sub(2, 3) = ${exports.sub(2, 3)}\n`
    output.value += `add(2, 3) = ${exports.add(2, 3)}\n`
  })
</script>

<textarea id="output" style="height: 100%; width: 100%" readonly></textarea>
```

Text after
