module.exports = {
  // '/stdlib/': getStdlibSidebar(),
  '/examples': getExamplesSidebar(),
  '/built-with-assemblyscript': getExamplesSidebar(),
  '/': getDefaultSidebar()
}

function getDefaultSidebar() {
  return [
    {
      title: "Introduction",
      path: '/introduction'
    },
    {
      title: "Getting started",
      path: '/getting-started'
    },
    {
      title: "Using the compiler",
      path: '/compiler'
    },
    {
      title: 'Using the language',
      collapsable: false,
      sidebarDepth: 0,
      children: [
        {
          title: "Concepts",
          path: '/concepts'
        },
        {
          title: "Types",
          path: '/types'
        },
        {
          title: "Standard library",
          collapsable: true,
          sidebarDepth: 0,
          children: [
            '/stdlib/globals',
            '/stdlib/array',
            '/stdlib/arraybuffer',
            '/stdlib/dataview',
            '/stdlib/date',
            '/stdlib/error',
            '/stdlib/math',
            '/stdlib/map',
            '/stdlib/number',
            '/stdlib/set',
            '/stdlib/staticarray',
            '/stdlib/string',
            '/stdlib/symbol',
            '/stdlib/typedarray'
          ]
        },
        {
          title: "Extended library",
          collapsable: true,
          sidebarDepth: 0,
          children: [
            '/stdlib/console',
            '/stdlib/crypto',
            '/stdlib/heap',
            '/stdlib/process'
          ]
        },
        {
          title: 'Implementation status',
          path: '/status'
        }
      ]
    },
    {
      title: "Using the runtime",
      path: "/runtime"
    }
  ]
}

function getExamplesSidebar() {
  return [
    {
      title: 'Examples',
      collapsable: false,
      children: [
        ['/examples', 'Overview'],
        '/examples/snippets',
      ]
    },
    {
      title: 'Starter examples',
      collapsable: false,
      children: [
        '/examples/mandelbrot',
        '/examples/interference',
        '/examples/game-of-life'
      ]
    },
    {
      title: 'Advanced examples',
      collapsable: false,
      children: [
        '/examples/arrays',
        ['https://github.com/AssemblyScript/examples/tree/main/i64', 'I64 as a (node) library'],
        ['https://github.com/AssemblyScript/examples/tree/main/sdk', 'Using the browser SDK'],
        ['https://github.com/AssemblyScript/examples/tree/main/transform', 'Using compiler transforms']
      ]
    },
    {
      title: 'Additional resources',
      collapsable: false,
      children: [
        ['https://wasmbyexample.dev/', 'Wasm By Example'],
        '/built-with-assemblyscript'
      ]
    }
  ]
}
