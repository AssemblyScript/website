<template>
  <div v-if="members.length > 0" class="community">
    <div class="list">
      <a v-for="member in members" href="https://discord.gg/assemblyscript" :title="member.username" :class="member.status" target="_blank" rel="noopener">
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
  background: #fff url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMCAxMCI+PHBhdGggZD0iTTUgMGE1IDUgMCAwMC0xLjA1OS4xMkEzLjA5IDMuMDkgMCAwMTYuMTggMy4wODdhMy4wOSAzLjA5IDAgMDEtMy4wOSAzLjA5QTMuMDkgMy4wOSAwIDAxLjEyIDMuOTMgNSA1IDAgMDAwIDVhNSA1IDAgMDA1IDUgNSA1IDAgMDA1LTUgNSA1IDAgMDAtNS01eiIgZmlsbD0iI2Y4YTczNSIvPjwvc3ZnPg==');
  background-size: 10px 10px;
}
.community .list a.dnd:before {
  background: #fff url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMCAxMCI+PHBhdGggZD0iTTUgMGE1IDUgMCAwMC01IDUgNSA1IDAgMDA1IDUgNSA1IDAgMDA1LTUgNSA1IDAgMDAtNS01ek0yIDRoNnYySDJWNHoiIGZpbGw9IiNlZDQ3NGEiLz48L3N2Zz4=');
  background-size: 10px 10px;
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
