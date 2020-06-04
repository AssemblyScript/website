// Editor component

let maximized = false
window.maximize = function(editorId) {
  const editor = document.getElementById(editorId)
  if (maximized = !maximized) {
    editor.classList.add('maximized')
    document.body.style.overflow = 'hidden'
    document.querySelector('#' + editorId + ' a.maximize').innerHTML = '🗗'
  } else {
    editor.classList.remove('maximized')
    document.body.style.overflow = 'auto'
    editor.scrollIntoView()
    document.querySelector('#' + editorId + ' a.maximize').innerHTML = '🗖'
  }
}
