const fetch = require('node-fetch')
const fs = require('fs')

const editorHtml = __dirname + '/../dist/editor.html'

// Pin SDK version in editor.html to prevent CDN caching issues
fetch('https://registry.npmjs.org/assemblyscript/latest')
  .then(res => res.json())
  .then(({ version }) => {
    const html = fs.readFileSync(editorHtml, 'utf-8')
    fs.writeFileSync(editorHtml,
      html.replace(/assemblyscript@latest\/dist\/sdk\.js/, `assemblyscript@${version}/dist/sdk.js`)
    )
    console.log(`Pinned SDK to v${version}`)
  })
