module.exports = {
  '/stdlib/': getStdlibSidebar(),
  '/examples': getExamplesSidebar(),
  '/built-with-assemblyscript': getExamplesSidebar(),
  '/': getDefaultSidebar()
}

function getDefaultSidebar() {
  return [
    {
      title: 'Getting started',
      collapsable: false,
      children: [
        '/introduction',
        '/quick-start',
        '/basics',
        '/status',
        '/frequently-asked-questions'
      ]
    },
    {
      title: 'Documentation',
      collapsable: false,
      children: [
        '/compiler',
        '/types',
        '/environment',
        '/exports-and-imports',
        '/loader'
      ]
    },
    {
      title: 'Advanced',
      collapsable: false,
      children: [
        '/memory',
        '/garbage-collection',
        '/peculiarities',
        '/portability',
        '/debugging',
        '/interoperability',
        '/development',
        '/transforms'
      ]
    }
  ]
}

function getStdlibSidebar() {
  return [
    {
      title: 'Standard Library',
      collapsable: false,
      children: [
        '/stdlib/globals',
        '/stdlib/array',
        '/stdlib/arraybuffer',
        '/stdlib/dataview',
        '/stdlib/date',
        '/stdlib/error',
        '/stdlib/map',
        '/stdlib/math',
        '/stdlib/number',
        '/stdlib/set',
        '/stdlib/string',
        '/stdlib/typedarray'
      ]
    },
    {
      title: 'Extended Library',
      collapsable: false,
      children: [
        '/stdlib/staticarray',
        '/stdlib/process',
        '/stdlib/console',
        '/stdlib/crypto'
      ]
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
        ['https://github.com/AssemblyScript/examples/tree/master/i64', 'I64 as a (node) library'],
        ['https://github.com/AssemblyScript/examples/tree/master/loader', 'Using the loader'],
        ['https://github.com/AssemblyScript/examples/tree/master/sdk', 'Using the browser SDK'],
        ['https://github.com/AssemblyScript/examples/tree/master/transform', 'Using compiler transforms']
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
