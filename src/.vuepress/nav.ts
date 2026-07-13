import type { NavbarOptions } from '@vuepress/theme-default'

export default [
  {
    text: 'Documentation',
    link: '/introduction.md'
  },
  {
    text: 'Examples',
    children: [
      {
        text: 'Overview',
        link: '/examples'
      },
      {
        text: 'Built with AssemblyScript',
        link: '/built-with-assemblyscript'
      }
    ]
  },
  {
    text: 'Community',
    children: [
      {
        text: 'Contributing guidelines',
        link: 'https://github.com/AssemblyScript/assemblyscript/blob/main/CONTRIBUTING.md'
      },
      {
        text: 'Code of Conduct',
        link: 'https://github.com/AssemblyScript/assemblyscript/blob/main/CODE_OF_CONDUCT.md'
      },
      {
        text: 'Social',
        children: [
          {
            text: 'Twitter',
            link: 'https://twitter.com/AssemblyScript'
          },
          {
            text: 'Discord',
            link: 'https://discord.gg/assemblyscript'
          }
        ]
      },
      {
        text: 'Q&A',
        children: [
          {
            text: 'Stack Overflow',
            link: 'https://stackoverflow.com/questions/tagged/assemblyscript'
          }
        ]
      }
    ]
  },
  {
    text: 'Support us',
    link: 'https://opencollective.com/assemblyscript'
  },
  {
    text: 'GitHub',
    link: 'https://github.com/AssemblyScript'
  },
] satisfies NavbarOptions
