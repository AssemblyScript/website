<template>
  <div v-if="members.length > 0" class="community">
    <div class="list">
      <a v-for="member in members" href="https://discord.gg/U63XU2J" :title="member.username" :class="member.status" target="_blank" rel="noopener">
        <img :src="member.avatar_url + '?size=64'" :alt="member.username" loading="lazy" />
      </a>
    </div>
  </div>
</template>

<script>
const widgetUrl = 'https://discordapp.com/api/guilds/721472913886281818/widget.json'

export default {
  name: 'Community',

  data() {
    return {
      members: this.members || []
    }
  },

  mounted() {
    fetch('https://green-sun-f03e.encors.workers.dev/?url=' + encodeURIComponent(widgetUrl), { mode: 'cors', credentials: 'omit' })
      .then(res => res.json())
      .then(({ members }) => {
        this.members = members.filter(member =>
          typeof member.username === 'string' &&
          typeof member.avatar_url === 'string' &&
          member.avatar_url.startsWith('https://cdn.discordapp.com/') &&
          ['online', 'idle', 'dnd'].includes(member.status))
      })
      .catch(err => {
        // don't show the widget
      })
  }
}
</script>

<style scoped>
.community .list {
  text-align: center;
}
.community .list a {
  display: inline-block;
  box-sizing: border-box;
  position: relative;
  top: 0;
  transition: top 100ms;
}
.community .list a:hover {
  top: -4px;
}
.community .list a:before {
  content: '';
  position: absolute;
  border-radius: 50%;
  background: #999;
  bottom: 2px;
  right: 2px;
  width: 10px;
  height: 10px;
  border: 2px solid #fff;
}
.community .list a.online:before {
  background: #49b684;
}
.community .list a.idle:before {
  background: #f8a735;
}
.community .list a.dnd:before {
  background: #ed474a;
}
.community .list img {
  width: 32px;
  height: 32px;
  overflow: hidden;
  border-radius: 50%;
  border: 1px solid #fff;
  box-shadow: 0 0 0 1px #007acc;
}
.community .list a {
  padding: 0.15rem;
}
</style>
