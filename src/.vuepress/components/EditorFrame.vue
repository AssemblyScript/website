<script setup lang="ts">
import { computed, onUnmounted, ref } from 'vue'

const props = defineProps<{
  initialSource: string
}>()

const editor = ref<HTMLElement | null>(null)
const isMaximized = ref(false)

const iframeSrc = computed(() => `/editor.html#${props.initialSource}`)

function updateBodyOverflow(): void {
  document.body.style.overflow = isMaximized.value ? 'hidden' : 'auto'
}

function toggleEditor(): void {
  isMaximized.value = !isMaximized.value
  updateBodyOverflow()

  if (!isMaximized.value) {
    editor.value?.scrollIntoView({
      block: 'nearest',
      behavior: 'smooth',
    })
  }
}

function closeEditor(): void {
  isMaximized.value = false
  document.body.style.overflow = 'auto'
}

onUnmounted(() => {
  if (isMaximized.value) closeEditor()
})
</script>

<template>
  <div ref="editor" class="editor-wrap" :class="{ maximized: isMaximized }">
    <button
      type="button"
      class="maximize"
      :aria-label="isMaximized ? 'Minimize editor' : 'Maximize editor'"
      @click="toggleEditor"
    >
      {{ isMaximized ? '◲' : '◰' }}
    </button>
    <iframe :src="iframeSrc" title="Editor" />
  </div>
</template>

<style scoped>
.editor-wrap {
  position: relative;
  margin-block: 1em;
}

.maximize {
  position: absolute;
  top: 8px;
  right: 12px;
  z-index: 1000;
  border: 0;
  padding: 0;
  background: transparent;
  color: #c7c4c7;
  cursor: pointer;
  font: inherit;
  font-size: 1.2rem;
  line-height: 1;
}

.maximize:hover {
  color: #fff;
}

iframe {
  width: 100%;
  height: 540px;
  min-height: 540px;
  border: 0;
  background: #1e1e1e;
  resize: vertical;
}

.maximized {
  position: fixed;
  z-index: 9000;
  inset: 0;
  margin: 0;
}

.maximized iframe {
  height: 100% !important;
  resize: none;
}
</style>
