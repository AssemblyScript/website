<template>
  <div v-if="contributors.length > 0" class="contributors">
    <h3>Contributors</h3>
    <div class="list">
      <a v-for="item in contributors" :href="item.link" :title="(item.count == 1 ? '1 contribution' : item.count + ' contributions') + ' by ' + item.name" target="_blank" rel="noopener">
        <img :src="item.logo + '&s=64'" :alt="item.name" loading="lazy" />
      </a>
    </div>
  </div>
</template>

<script>
import contributors from '../../../data/contributors.json'

export default {
  name: 'Contributors',

  data() {
    return {
      contributors
    }
  }
}
</script>

<style scoped>
.contributors h3 {
  text-align: center;
  border: 0;
}
.contributors .list {
  text-align: center;
}
.contributors .list a {
  display: inline-block;
  box-sizing: border-box;
  position: relative;
  top: 0;
  transition: top 100ms;
}
.contributors .list a:hover {
  top: -4px;
}
.contributors .list img {
  width: 31px;
  height: 31px;
  overflow: hidden;
  border-radius: 50%;
  border: 1px solid #fff;
  box-shadow: 0 0 0 1px #007acc;
}
.contributors .list a {
  padding: 0.15rem;
}
</style>
