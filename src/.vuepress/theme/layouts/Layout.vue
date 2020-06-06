<template>
  <div id="le">
    <Layout>
      <div slot="page-bottom" class="footer">Copyright © {{ new Date().getFullYear() }} The AssemblyScript Project | Apache-2.0</div>
    </Layout>
  </div>
</template>

<script>
import Layout from '@vuepress/theme-default/layouts/Layout.vue'

export default {
  components: {
    Layout
  },

  mounted() {
    // Fix scrolling to the referenced element upon initial page load
    const hash = document.location.hash;
    if (hash.length > 1) {
      const id = hash.substring(1)
      const element = document.getElementById(id)
      if (element) element.scrollIntoView()
    }
  }
}
</script>
