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
    {
      text: "Introduction",
      link: '/introduction'
    },
    {
      text: "Getting started",
      link: '/getting-started'
    },
    {
      text: "Using the compiler",
      link: '/compiler'
    },
    {
      text: 'Using the language',
      collapsible: false,
      // sidebarDepth: 0,
      children: [
        {
          text: "Concepts",
          link: '/concepts'
        },
        {
          text: "Types",
          link: '/types'
        },
        {
          text: "Standard library",
          collapsible: true,
          // sidebarDepth: 0,
          children: [
            '/stdlib/globals',
            '/stdlib/array',
            '/stdlib/arraybuffer',
            '/stdlib/console',
            '/stdlib/crypto',
            '/stdlib/dataview',
            '/stdlib/date',
            '/stdlib/error',
            '/stdlib/heap',
            '/stdlib/math',
            '/stdlib/map',
            '/stdlib/number',
            '/stdlib/process',
            '/stdlib/set',
            '/stdlib/staticarray',
            '/stdlib/string',
            '/stdlib/symbol',
            '/stdlib/typedarray'
          ]
        },
        {
          text: 'Implementation status',
          link: '/status'
        }
      ]
    },
    {
      text: "Using the runtime",
      link: "/runtime"
    }
  ] satisfies SidebarArrayOptions
}

function getExamplesSidebar(): SidebarArrayOptions {
  return [
    {
      text: 'Examples',
      collapsible: false,
      // sidebarDepth: 0,
      children: [
        {
          text: 'Overview',
          link: '/examples'
        }
      ]
    },
    {
      text: 'Starter examples',
      collapsible: false,
      // sidebarDepth: 0,
      children: [
        '/examples/mandelbrot',
        '/examples/interference',
        '/examples/game-of-life',
        '/examples/snippets',
      ]
    },
    {
      text: 'Advanced examples',
      collapsible: false,
      // sidebarDepth: 0,
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
      // sidebarDepth: 0,
      children: [
        {
          text: 'Wasm By Example',
          link: 'https://wasmbyexample.dev/'
        },
        '/built-with-assemblyscript'
      ]
    }
  ] satisfies SidebarArrayOptions
}
