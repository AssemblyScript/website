export const siteData = JSON.parse("{\"base\":\"/\",\"lang\":\"en-US\",\"title\":\"\",\"description\":\"\",\"head\":[[\"link\",{\"rel\":\"apple-touch-icon\",\"sizes\":\"180x180\",\"href\":\"/favicons/apple-touch-icon.png\"}],[\"link\",{\"rel\":\"icon\",\"type\":\"image/png\",\"sizes\":\"32x32\",\"href\":\"/favicons/favicon-32x32.png\"}],[\"link\",{\"rel\":\"icon\",\"type\":\"image/png\",\"sizes\":\"16x16\",\"href\":\"/favicons/favicon-16x16.png\"}],[\"link\",{\"rel\":\"manifest\",\"href\":\"/site.webmanifest\"}],[\"link\",{\"rel\":\"mask-icon\",\"href\":\"/favicons/safari-pinned-tab.svg\",\"color\":\"#007acc\"}],[\"link\",{\"rel\":\"shortcut icon\",\"href\":\"/favicon.ico\"}],[\"link\",{\"rel\":\"preconnect\",\"href\":\"https://cdn.jsdelivr.net\"}],[\"meta\",{\"name\":\"msapplication-TileColor\",\"content\":\"#ffffff\"}],[\"meta\",{\"name\":\"msapplication-config\",\"content\":\"/browserconfig.xml\"}],[\"meta\",{\"name\":\"theme-color\",\"content\":\"#ffffff\"}],[\"meta\",{\"name\":\"viewport\",\"content\":\"width=device-width, initial-scale=1\"}]],\"locales\":{\"/\":{\"lang\":\"en-US\",\"title\":\"The AssemblyScript Book\",\"description\":\"A TypeScript-like language for WebAssembly\"}}}")

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
  __VUE_HMR_RUNTIME__.updateSiteData?.(siteData)
}

if (import.meta.hot) {
  import.meta.hot.accept((m) => {
    __VUE_HMR_RUNTIME__.updateSiteData?.(m.siteData)
  })
}
