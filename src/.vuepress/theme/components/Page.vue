<script>
import Page from '@vuepress/theme-default/components/Page.vue'

const mounted = Page.mounted
Page.mounted = function() {
  if (mounted) mounted.call(Page, ...arguments)
  fixInitialScroll()
  installEditors()
}

const updated = Page.updated
Page.updated = function() {
  if (updated) updated.call(Page, ...arguments)
  installEditors()
}

// Fix initial load not scrolling to the referenced heading
function fixInitialScroll() {
  const hash = document.location.hash
  if (hash.length > 1) {
    const id = hash.substring(1)
    const element = document.getElementById(id)
    if (element) element.scrollIntoView()
  }
}

// Install editors by replacing their code block
function installEditors() {
  for (const element of document.querySelectorAll('div.language-editor')) {
    const code = element.querySelector('code')
    if (!code) continue

    const editor = document.createElement('div')
    editor.classList.add('editor-wrap')

    const maximize = document.createElement('a')
    maximize.classList.add('maximize')
    maximize.addEventListener('click', evt => { toggleEditor(editor) })
    maximize.innerText = '◰'
    editor.appendChild(maximize)

    const iframe = document.createElement('iframe')
    const pathWithHash = '/editor.html#' + btoa(code.innerText)
    iframe.setAttribute('title', 'Editor')
    if (document.readyState === 'complete') {
      iframe.setAttribute('src', pathWithHash)
    } else {
      iframe.setAttribute('src', 'data:text/html;base64,')
      document.addEventListener('readystatechange', evt => {
        if (document.readyState === 'complete') {
          iframe.setAttribute('src', pathWithHash)
        }
      })
    }
    editor.appendChild(iframe)

    element.parentNode.replaceChild(editor, element)
  }
}

// Toggle editor between inline and maximized
let isMaximized = false
function toggleEditor(editor) {
  if (isMaximized = !isMaximized) {
    editor.classList.add('maximized')
    document.body.style.overflow = 'hidden'
    editor.querySelector('a.maximize').innerHTML = '◲'
  } else {
    editor.classList.remove('maximized')
    document.body.style.overflow = 'auto'
    editor.scrollIntoView()
    editor.querySelector('a.maximize').innerHTML = '◰'
  }
}

export default Page
</script>

<style scoped>
.page {
  padding-bottom: 0;
}
</style>

<style>
.editor-wrap {
  position: relative;
  margin-block-start: 1em;
  margin-block-end: 1em;
}
.editor-wrap a.maximize {
  position: absolute;
  top: 8px;
  right: 12px;
  user-select: none;
  color: #c7c4c7;
  cursor: pointer;
  font-size: 1.2rem;
  z-index: 1000;
}
.editor-wrap a.maximize:hover {
  color: #fff;
  text-decoration: none;
}
.editor-wrap iframe {
  background: #1e1e1e;
  width: 100%;
  height: 540px;
  min-height: 540px;
  border: 0;
  resize: vertical;
}
.editor-wrap.maximized {
  position: fixed;
  margin-block-start: auto;
  margin-block-end: auto;
  z-index: 9000;
  margin: 0;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
}
.editor-wrap.maximized iframe {
  height: 100% !important;
  resize: none;
}
</style>
