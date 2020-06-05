module.exports = {
  '/stdlib/': getStdlibSidebar(),
  '/snippets/': getSnippetsSidebar(),
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
        '/basics'
      ]
    },
    {
      title: 'Documentation',
      collapsable: false,
      children: [
        'compiler',
        'types',
        'environment',
        'exports-and-imports',
        'loader',
        'built-with-assemblyscript'
      ]
    },
    {
      title: 'Advanced',
      collapsable: false,
      children: [
        'memory',
        'runtime',
        'peculiarities',
        'portability',
        'debugging',
        'interoperability',
        'development',
        'transforms'
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
        '/stdlib/staticarray'
      ]
    }
  ]
}

function getSnippetsSidebar() {
  return [
    {
      title: 'Snippets',
      collapsable: false,
      children: [
        '/snippets/classes',
      ]
    }
  ]
}
