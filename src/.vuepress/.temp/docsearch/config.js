
import { DocSearch, injectDocSearchConfig } from "/Volumes/Archive/Projects/Github/website/node_modules/@vuepress/plugin-docsearch/dist/client/index.js"
import '/Volumes/Archive/Projects/Github/website/node_modules/@docsearch/css/dist/style.css'
import '/Volumes/Archive/Projects/Github/website/node_modules/@vuepress/plugin-docsearch/dist/client/styles/docsearch.css'
import '/Volumes/Archive/Projects/Github/website/node_modules/@vuepress/plugin-docsearch/dist/client/styles/vars.css'

export default {
  enhance({ app }) {
    injectDocSearchConfig(app)
    app.component('SearchBox', DocSearch)
  },
}
