<template>
  <Layout>
    <div slot="page-bottom" class="footer">
      <p>Apache-2.0 licensed · Copyright © {{ new Date().getFullYear() }} The AssemblyScript Project</p>
    </div>
  </Layout>
</template>

<script>
import Layout from '@vuepress/theme-default/layouts/Layout.vue'

export default {
  components: {
    Layout
  }
}
</script>

<style scoped>
.footer {
  text-align: center;
  color: #4e6e8e;
}
</style>
