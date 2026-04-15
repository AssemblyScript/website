import type {
  SidebarArrayOptions,
  SidebarObjectOptions,
} from '@vuepress/theme-default'

export default {
  // '/stdlib/': getStdlibSidebar(),
  '/examples': getExamplesSidebar(),
  '/built-with-assemblyscript': getExamplesSidebar(),
  '/': getDefaultSidebar()
} satisfies SidebarObjectOptions

function getDefaultSidebar(): SidebarArrayOptions {
  return [
    { text: "Introduction", link: '/introduction' },
    { text: "Getting started", link: '/getting-started' },
    { text: "Using the compiler", link: '/compiler' },
    {
      text: 'Using the language',
      collapsible: false,
      children: [
        { text: "Concepts", link: '/concepts' },
        { text: "Types", link: '/types' },
        {
          text: "Standard library",
          collapsible: true,
          children: [
            { text: 'Globals', link: '/stdlib/globals' },
            { text: 'Array', link: '/stdlib/array' },
            { text: 'Arraybuffer', link: '/stdlib/arraybuffer' },
            { text: 'Console', link: '/stdlib/console' },
            { text: 'Crypto', link: '/stdlib/crypto' },
            { text: 'Dataview', link: '/stdlib/dataview' },
            { text: 'Date', link: '/stdlib/date' },
            { text: 'Error', link: '/stdlib/error' },
            { text: 'Heap', link: '/stdlib/heap' },
            { text: 'Math', link: '/stdlib/math' },
            { text: 'Map', link: '/stdlib/map' },
            { text: 'Number', link: '/stdlib/number' },
            { text: 'Process', link: '/stdlib/process' },
            { text: 'Set', link: '/stdlib/set' },
            { text: 'Staticarray', link: '/stdlib/staticarray' },
            { text: 'String', link: '/stdlib/string' },
            { text: 'Symbol', link: '/stdlib/symbol' },
            { text: 'Typedarray', link: '/stdlib/typedarray' },
          ]
        },
        { text: 'Implementation status', link: '/status' }
      ]
    },
    { text: "Using the runtime", link: "/runtime" }
  ] satisfies SidebarArrayOptions
}

function getExamplesSidebar(): SidebarArrayOptions {
  return [
    {
      text: 'Examples',
      collapsible: false,
      children: [
        { text: 'Overview', link: '/examples' }
      ]
    },
    {
      text: 'Starter examples',
      collapsible: false,
      children: [
        { text: 'Mandelbrot', link: '/examples/mandelbrot' },
        { text: 'Interference', link: '/examples/interference' },
        { text: 'Game of Life', link: '/examples/game-of-life' },
        { text: 'Snippets', link: '/examples/snippets' },
      ]
    },
    {
      text: 'Advanced examples',
      collapsible: false,
      children: [
        '/examples/arrays',
        {
          text: 'I64 as a (node) library',
          link: 'https://github.com/AssemblyScript/examples/tree/main/i64'
        },
        {
          text: 'Using the browser SDK',
          link: 'https://github.com/AssemblyScript/examples/tree/main/sdk'
        },
        {
          text: 'Using compiler transforms',
          link: 'https://github.com/AssemblyScript/examples/tree/main/transform'
        }
      ]
    },
    {
      text: 'Additional resources',
      collapsible: false,
      children: [
        { text: 'Wasm By Example', link: 'https://wasmbyexample.dev/' },
        { text: 'Build with AssemblyScript', link: '/built-with-assemblyscript' },
      ]
    }
  ] satisfies SidebarArrayOptions
}
