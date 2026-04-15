import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { viteBundler } from '@vuepress/bundler-vite'
import { docsearchPlugin } from '@vuepress/plugin-docsearch'
import { redirectPlugin } from '@vuepress/plugin-redirect'
import { registerComponentsPlugin } from '@vuepress/plugin-register-components'
import { defaultTheme } from '@vuepress/theme-default'
import { defineUserConfig } from 'vuepress'
import navbar from './nav'
import sidebar from './sidebar'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const redirectsFile = new URL('./redirects', import.meta.url)
const require = createRequire(import.meta.url)
const prism = require('prismjs')

require('prismjs/components/prism-typescript')

export default defineUserConfig({
  base: '/',
  dest: './dist',
  locales: {
    '/': {
      lang: 'en-US',
      title: 'The AssemblyScript Book',
      description: 'A TypeScript-like language for WebAssembly',
    },
  },
  head: [
    ['link', { rel: "apple-touch-icon", sizes: "180x180", href: "/favicons/apple-touch-icon.png" }],
    ['link', { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicons/favicon-32x32.png" }],
    ['link', { rel: "icon", type: "image/png", sizes: "16x16", href: "/favicons/favicon-16x16.png" }],
    ['link', { rel: "manifest", href: "/site.webmanifest" }],
    ['link', { rel: "mask-icon", href: "/favicons/safari-pinned-tab.svg", color: "#007acc" }],
    ['link', { rel: "shortcut icon", href: "/favicon.ico" }],
    ['link', { rel: "preconnect", href: "https://cdn.jsdelivr.net" }],
    ['meta', { name: "msapplication-TileColor", content: "#ffffff" }],
    ['meta', { name: "msapplication-config", content: "/browserconfig.xml" }],
    ['meta', { name: "theme-color", content: "#ffffff" }],
    ['meta', { name: "viewport", content: "width=device-width, initial-scale=1" }],
  ],
  bundler: viteBundler(),
  theme: defaultTheme({
    hostname: 'https://www.assemblyscript.org',
    logo: '/images/icon.svg',
    navbar,
    sidebar,
    sidebarDepth: 1,
    docsRepo: 'AssemblyScript/website',
    docsDir: 'src',
    docsBranch: 'main',
    editLinkText: 'Edit this page on GitHub',
    themePlugins: {
      copyCode: {
        locales: {
          '/': {
            copy: 'Copy code',
            copied: 'Copied',
          },
        },
      },
      sitemap: true,
    },
  }),
  plugins: [
    redirectPlugin({
      config: loadRedirects(),
    }),
    registerComponentsPlugin({
      componentsDir: resolve(__dirname, './components'),
    }),
    docsearchPlugin({
      // TODO: Replace with the real Algolia DocSearch app ID before enabling search in production.
      appId: 'TODO_DOCSEARCH_APP_ID',
      apiKey: 'ffb8769cdb0f8cfa20d6a307385cb7ba',
      indexName: 'assemblyscript',
    }),
  ],
  extendsMarkdown(md) {
    prism.languages.typescript.builtin = new RegExp(
      '\\b(?:' + [
        // Common types
        'string', 'number', 'boolean', 'symbol', 'void',

        // Common names
        'ArrayBuffer', 'Array', 'Int8Array', 'Int16Array', 'Int32Array', 'Uint8Array', 'Uint8ClampedArray',
        'Uint16Array', 'Uint32Array', 'Float32Array', 'Float64Array', 'DataView', 'String', 'Map', 'Set',
        'Promise', 'Math', 'Number', 'Boolean', 'Error', 'Date',

        // AssemblyScript types
        'i8', 'i16', 'i32', 'i64', 'isize', 'u8', 'u16', 'u32', 'u64', 'usize', 'bool', 'f32', 'f64', 'v128',
        'externref', 'auto',

        // AssemblyScript names
        'heap', 'memory', 'table', 'atomic', 'i8x16', 'i16x8', 'i32x4', 'i64x2', 'f32x4', 'f64x2', 'v32x2',
        'Int64Array', 'Uint64Array', 'Mathf', 'Bool', 'I8', 'I16', 'I32', 'I64', 'U8', 'U16', 'U32', 'U64',
        'F32', 'F64', 'idof', 'sizeof', 'alignof', 'offsetof', 'nameof',
      ].join('|') + ')\\b',
    )
  },
})

function loadRedirects(): Record<string, string> {
  return Object.fromEntries(
    readFileSync(redirectsFile, 'utf8')
      .split(/\r?\n/u)
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .map((line) => {
        const separatorIndex = line.search(/\s/u)

        if (separatorIndex === -1) {
          throw new Error(`Invalid redirect entry: ${line}`)
        }

        return [line.slice(0, separatorIndex), line.slice(separatorIndex).trim()]
      }),
  )
}
