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
  }
}
</script>
