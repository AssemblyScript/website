---
metaTitle: AssemblyScript
description: Definitely not a TypeScript to WebAssembly compiler 🚀
navbar: false
sidebar: false
editLink: false
pageClass: frontpage
---

<div id="hero">
  <div id="logo">
    <svg viewBox="0 0 768 256"><path d="M239.972.004a168.23 168.23 0 00-33.502 3.339 163.17 163.17 0 00-31.722 9.684 169.571 169.571 0 00-29.385 15.693c-9.275 6.159-17.919 13.246-25.933 21.26L89.378 80.032H41.405L1.336 119.99l28.382 28.383-9.127 27.269c-5.12 5.713-9.089 11.576-11.909 17.586a87.137 87.137 0 00-6.121 18.81C1.299 218.644.557 225.582.334 232.854A759.765 759.765 0 000 256.004h16.028c6.01 0 11.873-.297 17.586-.891a93.642 93.642 0 0016.584-3.227 76.878 76.878 0 0015.694-6.233c5.046-2.671 9.87-6.085 14.47-10.24l27.27-9.127 28.382 28.382c6.333-7.12 6.333-16.517.012-22.776l-25.708-25.49-16.892 5.315-49.288-49.368 5.107-17.02-25.203-25.34 23.93-23.929 47.495.183 35.316-35.022a152.05 152.05 0 0117.03-14.692 161.081 161.081 0 0119.144-12.243c3.024-1.707 3.964-2.176 7.569-3.673 10.24-4.897 20.85-8.533 31.832-10.908a154.989 154.989 0 0133.614-3.673c0 11.353-1.224 22.52-3.673 33.502-2.448 10.982-6.085 21.63-10.908 31.945-1.384 3.247-1.853 4.187-3.673 7.568-1.818 3.34-5.664 9.548-5.664 9.548 14.385 1.764 27.298-18.366 31.546-29.71 2.326-6.241 3.765-12.78 5.061-19.35a168.234 168.234 0 003.34-33.503V.004zM37.51 181.541l8.46 8.46c-2.45 2.373-4.527 4.86-6.234 7.457a47.432 47.432 0 00-4.119 8.236 56.942 56.942 0 00-2.447 8.793c-.52 3.042-.929 6.234-1.226 9.573 3.34-.297 6.53-.742 9.572-1.336a44.096 44.096 0 008.794-2.45 38.85 38.85 0 008.236-4.117c2.597-1.632 5.083-3.674 7.457-6.122l8.46 8.459c-3.487 4.452-7.494 8.051-12.02 10.797a60.64 60.64 0 01-14.47 6.567 75.691 75.691 0 01-15.917 3.228 146.96 146.96 0 01-16.028.89c0-5.269.26-10.648.78-16.14a86.584 86.584 0 013.227-15.804 67.096 67.096 0 016.567-14.47c2.82-4.526 6.456-8.534 10.908-12.021z"/><path d="M207.866 193.652H198.4l-7.735-20.458h-30.942l-7.277 20.458h-9.517l27.99-72.977h8.855zm-20-28.143l-11.45-31.094q-.56-1.526-1.12-4.885h-.204q-.509 3.104-1.17 4.885l-11.349 31.094zm22.417 26.26v-8.957q6.82 5.038 15.013 5.038 10.992 0 10.992-7.328 0-2.087-.967-3.511-.916-1.476-2.544-2.596-1.578-1.12-3.766-1.985-2.138-.916-4.631-1.883-3.46-1.374-6.107-2.748-2.596-1.425-4.377-3.155-1.73-1.781-2.646-4.02-.865-2.24-.865-5.242 0-3.664 1.68-6.463 1.679-2.85 4.478-4.733 2.799-1.934 6.36-2.9 3.614-.967 7.43-.967 6.77 0 12.113 2.34v8.448q-5.75-3.766-13.232-3.766-2.34 0-4.224.56-1.883.51-3.257 1.476-1.323.967-2.086 2.341-.713 1.323-.713 2.952 0 2.035.713 3.41.763 1.373 2.188 2.442 1.425 1.069 3.46 1.934 2.036.865 4.632 1.883 3.46 1.323 6.208 2.748 2.749 1.374 4.682 3.155 1.934 1.73 2.952 4.02 1.069 2.29 1.069 5.446 0 3.867-1.73 6.717-1.68 2.85-4.53 4.733-2.85 1.883-6.565 2.8-3.715.915-7.786.915-8.04 0-13.944-3.104zm40.178 0v-8.957q6.82 5.038 15.013 5.038 10.992 0 10.992-7.328 0-2.087-.967-3.511-.916-1.476-2.544-2.596-1.578-1.12-3.766-1.985-2.137-.916-4.631-1.883-3.46-1.374-6.107-2.748-2.595-1.425-4.376-3.155-1.73-1.781-2.647-4.02-.865-2.24-.865-5.242 0-3.664 1.68-6.463 1.679-2.85 4.478-4.733 2.799-1.934 6.361-2.9 3.613-.967 7.43-.967 6.769 0 12.112 2.34v8.448q-5.75-3.766-13.231-3.766-2.341 0-4.224.56-1.883.51-3.257 1.476-1.324.967-2.087 2.341-.712 1.323-.712 2.952 0 2.035.712 3.41.763 1.373 2.188 2.442 1.425 1.069 3.461 1.934 2.036.865 4.631 1.883 3.46 1.323 6.209 2.748 2.748 1.374 4.682 3.155 1.933 1.73 2.951 4.02 1.069 2.29 1.069 5.446 0 3.867-1.73 6.717-1.68 2.85-4.53 4.733-2.85 1.883-6.565 2.8-3.715.915-7.786.915-8.04 0-13.944-3.104zm85.216-22.087h-36.793q.203 8.703 4.682 13.435 4.478 4.733 12.315 4.733 8.804 0 16.183-5.801v7.837q-6.87 4.987-18.168 4.987-11.043 0-17.353-7.074-6.31-7.124-6.31-20 0-12.162 6.87-19.796 6.92-7.684 17.15-7.684 10.229 0 15.827 6.615 5.597 6.616 5.597 18.372zm-8.55-7.073q-.05-7.227-3.51-11.247-3.41-4.02-9.517-4.02-5.903 0-10.025 4.223-4.123 4.224-5.09 11.044zm91.223 31.043h-8.347v-29.924q0-8.651-2.697-12.519-2.646-3.868-8.957-3.868-5.343 0-9.11 4.886-3.714 4.885-3.714 11.705v29.72h-8.346V162.71q0-15.369-11.858-15.369-5.496 0-9.058 4.631-3.562 4.58-3.562 11.96v29.72h-8.346V141.54h8.346v8.244h.203q5.547-9.465 16.183-9.465 5.344 0 9.313 3.002 3.97 2.952 5.445 7.786 5.802-10.788 17.303-10.788 17.201 0 17.201 21.22zm20.33-7.532h-.203v7.532h-8.346v-77.15h8.346V150.7h.203q6.158-10.381 18.015-10.381 10.026 0 15.675 7.022 5.7 6.972 5.7 18.728 0 13.079-6.362 20.967-6.361 7.837-17.405 7.837-10.33 0-15.623-8.753zm-.203-21.018v7.278q0 6.463 4.173 10.992 4.223 4.478 10.687 4.478 7.582 0 11.857-5.801 4.326-5.802 4.326-16.133 0-8.702-4.02-13.638-4.021-4.937-10.891-4.937-7.278 0-11.705 5.09-4.427 5.038-4.427 12.671zm57.277 28.55h-8.346v-77.15h8.346zm54.376-52.112l-23.969 60.458q-6.412 16.183-18.015 16.183-3.257 0-5.445-.662v-7.48q2.697.915 4.936.915 6.31 0 9.466-7.531l4.173-9.873-20.357-52.01h9.263l14.096 40.102q.255.763 1.069 3.969h.305q.255-1.221 1.018-3.868l14.81-40.203zM553.77 191.056v-5.75q7.837 4.987 15.877 4.987 8.55 0 12.977-3.511 4.428-3.563 4.428-9.924 0-5.598-3.003-8.906-2.951-3.359-12.875-9.11-11.094-6.462-14.046-10.788-2.951-4.377-2.951-10.076 0-7.736 6.005-13.13 6.005-5.394 16.03-5.394 6.514 0 13.028 2.188v5.292q-6.412-2.9-13.69-2.9-7.43 0-11.806 3.766-4.326 3.765-4.326 9.567 0 5.598 2.952 8.906 3.002 3.308 12.875 9.007 10.23 5.802 13.588 10.331 3.41 4.478 3.41 10.33 0 8.398-5.853 13.69-5.801 5.293-16.437 5.293-3.766 0-8.703-1.17-4.885-1.171-7.48-2.698zm82.926.306q-5.802 3.562-13.843 3.562-10.636 0-17.15-7.277-6.514-7.329-6.514-19.135 0-12.417 7.329-20.305 7.328-7.94 18.829-7.94 5.954 0 11.552 2.443v5.293q-5.598-3.46-12.265-3.46-9.16 0-14.86 6.615-5.7 6.565-5.7 17.049 0 10.127 5.192 16.284 5.241 6.158 13.79 6.158 7.838 0 13.64-4.173zm33.054-44.937q-2.342-1.679-5.497-1.679-6.158 0-10.33 6.361-4.174 6.362-4.174 18.066v24.479h-4.58V141.54h4.58v11.552h.204q1.78-5.954 5.649-9.262 3.867-3.308 8.956-3.308 2.901 0 5.191.916zm8.116-18.015q-1.526 0-2.697-1.12-1.17-1.119-1.17-2.85 0-1.679 1.17-2.696 1.221-1.07 2.697-1.07 1.578 0 2.748 1.019 1.222 1.018 1.222 2.748 0 1.628-1.17 2.799-1.171 1.17-2.8 1.17zm-2.29 65.242V141.54h4.682v52.112zm22.265-9.262h-.204v33.231h-4.681V141.54h4.681v10.738h.204q2.799-5.75 7.99-8.855 5.242-3.155 11.501-3.155 9.924 0 15.47 6.87 5.599 6.82 5.599 18.575 0 13.079-6.413 21.17-6.36 8.041-16.844 8.041-11.705 0-17.303-10.534zm-.204-19.39v6.565q0 7.837 4.937 13.486 4.936 5.598 12.977 5.598 7.99 0 12.977-6.82 4.987-6.87 4.987-18.014 0-9.771-4.58-15.522-4.58-5.75-12.214-5.75-9.109 0-14.096 6.106-4.988 6.107-4.988 14.351zm70.357 27.94q-3.664 1.73-6.87 1.73-11.553 0-11.553-13.843v-35.012h-9.363v-4.275h9.363v-13.537q1.12-.407 2.341-.814 1.222-.356 2.341-.763v15.114h13.74v4.275h-13.74v34.402q0 5.394 1.68 7.837 1.73 2.392 5.801 2.392 2.9 0 6.26-1.883z"/></svg>
  </div>
  <h1>A language made for WebAssembly.</h1>
  <p class="action">
    <a href="/introduction.html" class="docs">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><path d="M0 0v256h256V0h-98.4c0 15-11.1 30-29.4 30A29.5 29.5 0 0198.5 0z" fill="#007acc"/><path d="M100.35 117.107h2.025l52.506 115.818h-24.818l-5.402-13H78.063l-5.402 13H49.869zm15.87 83.065l-8.274-19.922q-1.35-3.377-2.532-6.753-1.182-3.377-2.195-6.585-1.182-3.714-2.195-7.26-1.181 4.222-2.194 7.43-1.013 3.207-2.195 6.921-1.182 3.546-2.364 6.247l-8.273 19.922zm79.306 34.273q-8.273 0-15.026-1.857-6.753-1.858-12.156-5.065-5.402-3.208-9.454-7.598-3.883-4.558-6.416-9.623l19.247-11.143q3.883 6.247 9.117 10.299 5.402 4.052 14.181 4.052 7.429 0 11.65-3.208 4.39-3.377 4.39-8.442 0-6.077-4.56-9.116-4.558-3.04-12.661-6.585l-5.91-2.532q-6.415-2.702-11.649-5.91-5.234-3.207-8.948-7.428-3.714-4.22-5.74-9.623-2.026-5.403-2.026-12.663 0-6.584 2.364-12.324 2.532-5.74 6.922-9.961 4.558-4.22 10.974-6.585 6.415-2.363 14.35-2.363 11.312 0 19.416 4.39 8.272 4.22 14.182 14.519l-18.403 11.818q-3.039-5.403-6.584-7.766-3.546-2.364-8.61-2.364-5.234 0-8.273 2.87-3.04 2.87-3.04 7.26 0 5.403 3.377 8.273 3.546 2.701 11.143 6.078l5.91 2.532q7.596 3.208 13.337 6.753 5.909 3.377 9.792 7.766 4.052 4.221 6.078 9.793 2.195 5.402 2.195 12.83 0 7.936-3.04 14.183-2.87 6.077-8.103 10.298-5.234 4.221-12.494 6.416-7.09 2.026-15.532 2.026z" fill="#fff"/></svg>
      Get Started
    </a>
    <a href="https://github.com/AssemblyScript" target="_blank" rel="noopener" class="github">
      <svg viewBox="0 0 24 24"><path fill="#fff" d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"></path></svg>
      <span class="title">GitHub</span>
    </a>
    <a href="https://www.npmjs.com/package/assemblyscript" target="_blank" rel="noopener" class="npm">
      <svg viewBox="0 0 24 24"><path fill="#fff" d="M2 22h9.913V7.043h5.044V22H22V2H2z"/></svg>
      <span class="title">npm</span>
    </a>
  </p>
</div>

<div id="notice" style="margin-top: 100px; margin-bottom: -20px; background: #027acc; color: #fff; padding: 0.5em 2em">
  <h2>URGENT NOTICE TO OUR USERS, STAKEHOLDERS AND SPONSORS</h2>
  <p>On August 3rd, the WebAssembly CG will poll on whether JavaScript string semantics/encoding are out of scope of the Interface Types proposal. This decision will likely be backed by Google, Mozilla and the Bytecode Alliance/WASI, who appear to have a common interest to exclusively promote C++, Rust respectively non-Web semantics and concepts in WebAssembly.</p>
  <p>If the poll passes, which is likely, the decision will impact languages utilizing JavaScript-like 16-bit string semantics (see <a href="https://developer.mozilla.org/en-US/docs/Web/API/DOMString" target="_blank" rel="noopener" style="color: #fff; font-weight: normal">DOMString</a>, also <a href="https://docs.microsoft.com/en-us/dotnet/api/system.string" target="_blank" rel="noopener" style="color: #fff; font-weight: normal">C#</a>, <a href="https://docs.oracle.com/en/java/javase/16/docs/api/java.base/java/lang/String.html" target="_blank" rel="noopener" style="color: #fff; font-weight: normal">Java</a>) including AssemblyScript and its users. This impact means that there will not be an optimal path towards interop between JavaScript and WebAssembly modules written in AssemblyScript: if Interface Types does not accept to have JavaScript string semantics as a default option, strings will need to be converted at the JS-Wasm boundaries and data will be lost when JS passes strings to a Wasm module, or vice versa.</p>
  <p>It is our expectation that AssemblyScript's only viable way forward to guarantee data integrity will be to replace its dependency upon Interface Types with a dependency upon Reference Types and import its standard library from JavaScript. The reason for this is that we do not have the resources to maintain multiple separate output targets in core (more manpower for the maintenance effort would be needed).
  <p>While the full impact cannot be known, this transition may either turn out to be too large in scope, or, if it can be done, is likely to impact users running AssemblyScript on WASI hosts like Wasmtime and Wasmer, in that neither the JavaScript standard library nor a GC will be available on these platforms. As a result, it would likely not be feasible anymore to utilize future versions of AssemblyScript on these platforms unless the core team can gain the needed resources to make this happen, and we would strongly recommend to avoid earlier versions since these will not be safe. However even if AssemblyScript does manage to gain resources to be able to handle this future, it would be a non-ideal situation that will cost more compared to if the Interface Types proposal prioritizes Web+Wasm compatibility out of the box. Such compatibility would be great for other WebAssembly languages and WebAssembly itself.</p>
  <p>We believe that the potential Web platform, programming language and security breakage, as well as the potential unfortunate outcome for the AssemblyScript project, should be prevented.</p>
  <p>We need 👉<strong><em>your</em></strong> help. What you can do is enter the WebAssembly community group meeting on August 3rd (and other meetings in general if you want to be part of helping to shape the future of this great space) by following the instructions at https://github.com/WebAssembly/meetings/blob/main/process/attendance.md, and voting against any direction that is not in favor of not prioritizing the Web platform as a first class citizen (JavaScript + WebAssembly). This will ensure that JavaScript + WebAssembly has an optimal path without any issues, keeping the Web platform on it's way to greatness.
  <p>�hank you for your consideration! </p>
</div>

<div id="features">
  <div class="feature">
    <h2>Designed for WebAssembly</h2>
    <p>AssemblyScript targets WebAssembly's feature set specifically, giving developers low-level control over their code.</p>
  </div>
  <div class="feature">
    <h2>Familiar TypeScript syntax</h2>
    <p>Being a variant of TypeScript makes it easy to compile to WebAssembly without learning a new language.</p>
  </div>
  <div class="feature">
    <h2>Right at your fingertips</h2>
    <p>Integrates with the existing Web ecosystem - no heavy toolchains to set up. Simply <code>npm install</code> it!</p>
  </div>
</div>

<div id="try">

```editor
#!runtime=stub
/** Calculates the n-th Fibonacci number. */
export function fib(n: i32): i32 {
  var a = 0, b = 1
  if (n > 0) {
    while (--n) {
      let t = a + b
      a = b
      b = t
    }
    return b
  }
  return a
}

#!html
<textarea id="output" style="height: 100%; width: 100%" readonly></textarea>
<script>
loader.instantiate(module_wasm, { /* imports */ })
  .then(({ exports }) => {
    const output = document.getElementById('output')
    for (let i = 0; i <= 10; ++i) {
      output.value += `fib(${i}) = ${exports.fib(i)}\n`
    }
  })
</script>
```

</div>

<div id="contributors">
  <p>AssemblyScript is free and open source software released under the <a href="https://www.apache.org/licenses/LICENSE-2.0" target="_blank" rel="noopener">Apache License, Version 2.0</a>, builds upon <a href="https://github.com/WebAssembly/binaryen" target="_blank" rel="noopener">Binaryen</a> and is based on the <a href="https://webassembly.org/" target="_blank" rel="noopener">WebAssembly specification</a>. It is brought to you by the following awesome people:</p>
  <Contributors />
</div>

<div id="testimonials">
  <h2>Why AssemblyScript?</h2>
  <Testimonials />
</div>

<div id="sponsors">
  <h2>Thanks to our sponsors!</h2>
  <p>Most of the core team members and most contributors do this open source work in their free time. If you use AssemblyScript for a serious task or plan to do so, and you'd like us to invest more time on it, <a href="https://opencollective.com/assemblyscript/donate" target="_blank" rel="noopener">please donate</a> to our <a href="https://opencollective.com/assemblyscript" target="_blank" rel="noopener">OpenCollective</a>. By sponsoring this project, your logo will show up below. Thank you so much for your support!</p>
  <Sponsors />
</div>

<div id="community">
  <h2><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 245 240"><path d="M104.4 103.9c-5.7 0-10.2 5-10.2 11.1s4.6 11.1 10.2 11.1c5.7 0 10.2-5 10.2-11.1.1-6.1-4.5-11.1-10.2-11.1zM140.9 103.9c-5.7 0-10.2 5-10.2 11.1s4.6 11.1 10.2 11.1c5.7 0 10.2-5 10.2-11.1s-4.5-11.1-10.2-11.1z"/><path class="st0" d="M189.5 20h-134C44.2 20 35 29.2 35 40.6v135.2c0 11.4 9.2 20.6 20.5 20.6h113.4l-5.3-18.5 12.8 11.9 12.1 11.2 21.5 19V40.6c0-11.4-9.2-20.6-20.5-20.6zm-38.6 130.6s-3.6-4.3-6.6-8.1c13.1-3.7 18.1-11.9 18.1-11.9-4.1 2.7-8 4.6-11.5 5.9-5 2.1-9.8 3.5-14.5 4.3-9.6 1.8-18.4 1.3-25.9-.1-5.7-1.1-10.6-2.7-14.7-4.3-2.3-.9-4.8-2-7.3-3.4-.3-.2-.6-.3-.9-.5-.2-.1-.3-.2-.4-.3-1.8-1-2.8-1.7-2.8-1.7s4.8 8 17.5 11.8c-3 3.8-6.7 8.3-6.7 8.3-22.1-.7-30.5-15.2-30.5-15.2 0-32.2 14.4-58.3 14.4-58.3 14.4-10.8 28.1-10.5 28.1-10.5l1 1.2c-18 5.2-26.3 13.1-26.3 13.1s2.2-1.2 5.9-2.9c10.7-4.7 19.2-6 22.7-6.3.6-.1 1.1-.2 1.7-.2 6.1-.8 13-1 20.2-.2 9.5 1.1 19.7 3.9 30.1 9.6 0 0-7.9-7.5-24.9-12.7l1.4-1.6s13.7-.3 28.1 10.5c0 0 14.4 26.1 14.4 58.3 0 0-8.5 14.5-30.6 15.2z"/></svg> Join our Discord</h2>
  <p>If you have questions only a human can answer, would like to show others what you are working on or just want to hang out with other AssemblyScript folks, make sure to <a href="https://discord.gg/assemblyscript" target="_blank" rel="noopener">join our Discord server</a>! There you'll find channels for <strong>#announcements</strong>, <strong>#help</strong>, and more.</p>
  <Community />
</div>

<style scoped>
#hero {
  margin-top: 2rem;
  text-align: center;
  height: 400px;
  background: #007acc;
}
#hero:before {
  content: '';
  position: absolute;
  z-index: 0;
  top: 0;
  left: 0;
  width: 100%;
  height: 520px;
  background: #007acc url(/images/header.svg) center bottom no-repeat;
  background-size: 1440px;
}
#hero > * {
  position: relative;
}
#hero h1 {
  color: #fff;
  margin: 1.3rem auto 1.8rem;
  font-size: 2rem;
  font-weight: 200;
}
#logo {
  display: inline-block;
  width: 640px;
}
#logo svg {
  width: 100%;
  height: 100%;
  max-height: 240px;
  fill: #fff;
}
@media only screen and (max-width: 740px) {
  #logo {
    width: 100%;
  }
  #logo svg {
    max-height: 213px;
  }
}
#features {
  padding: 1.2rem 0 0;
  margin-top: 2.5rem;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  align-content: stretch;
  justify-content: space-between;
}
#features .feature {
  flex-grow: 1;
  flex-basis: 30%;
  max-width: 30%;
}
#features h2 {
  font-size: 1.4rem;
  border-bottom: none;
  padding-bottom: 0;
  color: #3a5169;
}
.action {
  text-align: center;
  user-select: none;
}
.action a {
  display: inline-block;
  font-size: 1.2rem;
  color: #fff;
  background-color: #007acc;
  padding: .8rem 1.6rem;
  border-radius: 4px;
  transition: background-color .1s ease;
  box-sizing: border-box;
  border-bottom: 1px solid #006eb8;
  text-decoration: none !important;
  margin: 0.1rem 0;
}
.action a:hover {
  background-color: #1a8ae7;
}
.action a svg {
  width: 2em;
  position: relative;
  left: -10px;
  float: left;
  height: 32px;
}
.action a.docs {
  color: #111;
  background: #fff;
  border-bottom-color: #aaa;
}
.action a.docs:hover {
  background: #eee;
}
.action a.github {
  color: #fff;
  background: #24292e;
  border-bottom-color: #101214;
}
.action a.github:hover {
  background: #3e464f;
}
.action a.npm {
  color: #fff;
  background: #cb3837;
  border-bottom-color: #ba3232;
}
.action a.npm:hover {
  background: #eb3f3f;
}
@media only screen and (max-width: 720px) {
  .action a.github svg {
    float: none;
    left: 0;
    margin-bottom: -0.5rem;
  }
  .action a.npm {
    display: none;
  }
  .action a.github .title {
    display: none;
  }
  #features .feature {
    flex-basis: 100%;
    max-width: 100%;
  }
}
@media only screen and (max-width: 640px) {
  #try {
    display: none;
  }
}
#sponsors {
  margin-bottom: 2rem;
}
#community h2 svg {
  display: inline-block;
  height: 25px;
  position: relative;
  top: 3px;
}
</style>

<style>
.frontpage .page-edit {
  display: none;
}
</style>
