import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { viteBundler } from '@vuepress/bundler-vite'
import { docsearchPlugin } from '@vuepress/plugin-docsearch'
import { redirectPlugin } from '@vuepress/plugin-redirect'
import { shikiPlugin } from '@vuepress/plugin-shiki'
import { registerComponentsPlugin } from '@vuepress/plugin-register-components'
import { defaultTheme } from '@vuepress/theme-default'
import { defineUserConfig } from 'vuepress'
import navbar from './nav'
import sidebar from './sidebar'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const redirectsFile = new URL('./redirects', import.meta.url)
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
    externalLinkIcon: false,
    navbar,
    sidebar,
    sidebarDepth: 1,
    docsRepo: 'AssemblyScript/website',
    docsDir: 'src',
    docsBranch: 'main',
    editLinkText: 'Edit this page on GitHub',
    colorMode: 'auto',
    colorModeSwitch: true,
    themePlugins: {
      copyCode: {
        locales: {
          '/': {
            copy: 'Copy code',
            copied: 'Copied',
          },
        },
      },
      prismjs: false,
      sitemap: true,
    },
  }),
  plugins: [
    shikiPlugin({
      langs: ['ts', 'js', 'json', 'md', 'bash'],
      langAlias: {
        editor: 'ts',
      },
      themes: {
        light: 'light-plus',
        dark: 'ayu-mirage',
      },
      lineNumbers: false,
    }),
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
  ]
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
