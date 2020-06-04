module.exports = {
  base: '/',
  dest: './dist',
  locales: {
    '/': {
      lang: 'en-US',
      title: 'The AssemblyScript Book',
      description: 'Definitely not a TypeScript to WebAssembly compiler 🚀',
    }
  },
  head: [
    ['link', { rel: "apple-touch-icon", sizes: "180x180", href: "/favicons/apple-touch-icon.png"}],
    ['link', { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicons/favicon-32x32.png"}],
    ['link', { rel: "icon", type: "image/png", sizes: "16x16", href: "/favicons/favicon-16x16.png"}],
    ['link', { rel: "manifest", href: "/site.webmanifest"}],
    ['link', { rel: "mask-icon", href: "/favicons/safari-pinned-tab.svg", color: "#007acc"}],
    ['link', { rel: "shortcut icon", href: "/favicon.ico"}],
    ['link', { rel: "preconnect", href: "https://cdn.jsdelivr.net"}],
    ['meta', { name: "msapplication-TileColor", content: "#ffffff"}],
    ['meta', { name: "msapplication-config", content: "/browserconfig.xml"}],
    ['meta', { name: "theme-color", content: "#ffffff"}],
    ['meta', { name: "viewport", content: "width=device-width, initial-scale=1"}]
  ],
  theme: '.vuepress/theme',
  themeConfig: {
    logo: '/images/icon.svg',
    nav: require('./nav'),
    sidebar: require('./sidebar'),
    sidebarDepth: 1,
    docsRepo: 'AssemblyScript/website',
    docsDir: 'src',
    docsBranch: 'master',
    editLinks: true,
    editLinkText: 'Edit this page on GitHub',
    algolia: {
      apiKey: 'ffb8769cdb0f8cfa20d6a307385cb7ba',
      indexName: 'assemblyscript'
    }
  },
  evergreen: true,
  extraWatchFiles: [
    '.vuepress/nav.js',
    '.vuepress/sidebar.js',
    '**/*.md',
    '**/*.vue'
  ],
  plugins: [
    '@vuepress/plugin-html-redirect',
    'vuepress-plugin-serve',
    ['vuepress-plugin-sitemap', {
      hostname: 'https://assemblyscript.org',
      exclude: ['/404.html']
    }]
  ],
  chainWebpack(config, isServer) {
    if (isServer) return
    config
      .entry('custom')
      .add('./src/.vuepress/custom.js')
  },
  markdown: {
    extendMarkdown
  }
}

function extendMarkdown(md) {
  const prism = require('prismjs')

  // Extend TypeScript grammar

  require('prismjs/components/prism-typescript')
  prism.languages.typescript.builtin = new RegExp('\\b(?:' + [

    // Common types
    'string', 'number', 'boolean', 'symbol', 'void',

    // Common names
    'ArrayBuffer', 'String', 'Array', 'Int8Array', 'Int16Array', 'Int32Array', 'Uint8Array',
    'Uint8ClampedArray', 'Uint16Array', 'Uint32Array', 'Float32Array', 'Float64Array', 'DataView',
    'Map', 'Set', 'Promise', 'Math', 'Number', 'Error', 'Date',

    // AssemblyScript types
    'i8', 'i16', 'i32', 'i64', 'isize', 'u8', 'u16', 'u32', 'u64', 'usize', 'bool', 'f32', 'f64',
    'v128', 'anyref', 'auto',

    // AssemblyScript names
    'memory', 'table', 'atomic', 'i8x16', 'i16x8', 'i32x4', 'i64x2', 'f32x4', 'f64x2', 'v8x16',
    'v16x8', 'v32x2', 'Int64Array', 'Uint64Array',

  ].join('|') + ')\\b')

  injectEditor(prism)
}

function injectEditor(prism) {
  const he = require('he')

  prism.languages.editor = {}
  prism.hooks.add('before-tokenize', env => {
    if (env.language == 'editor') {
      env.originalCode = env.code || ''
      env.code = ''
    }
  })
  prism.hooks.add('after-tokenize', env => {
    if (env.language == 'editor') {
      env.tokens = [
        new prism.Token('', env.originalCode, undefined, env.originalCode, undefined)
      ]
    }
  })
  let nextEditorId = 1
  prism.hooks.add('wrap', env => {
    if (env.language == 'editor') {
      // FIXME: this breaks on reload for some reason
      const data = Buffer.from(he.decode(env.content), 'utf8').toString('base64')
      env.tag = 'div'
      env.classes.push('editor-wrap')
      env.attributes.id = 'editor' + nextEditorId
      env.content = '<a class="maximize" onclick="maximize(\'editor' + nextEditorId + '\')">🗖</a><iframe title="Editor" src="/editor.html#' + data + '"></iframe>'
      ++nextEditorId
    }
  })
}
