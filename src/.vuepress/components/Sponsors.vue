<template>
  <div class="sponsors">
    <div v-if="platinum.length > 0" class="platinum">
      <h3>Platinum Sponsors</h3>
      <div class="list">
        <a v-for="item in platinum" :href="item.link" :title="formatAmount(item.amount) + ' by ' + item.name" target="_blank" rel="noopener">
          <img :src="item.logo" :alt="item.name" loading="lazy" />
        </a>
      </div>
    </div>
    <div v-if="gold.length > 0" class="gold">
      <h3>Gold Sponsors</h3>
      <div class="list">
        <a v-for="item in gold" :href="item.link" :title="formatAmount(item.amount) + ' by ' + item.name" target="_blank" rel="noopener">
          <img :src="item.logo" :alt="item.name" loading="lazy" />
        </a>
      </div>
    </div>
    <div v-if="silver.length > 0" class="silver">
      <h3>Silver Sponsors</h3>
      <div class="list">
        <a v-for="item in silver" :href="item.link" :title="formatAmount(item.amount) + ' by ' + item.name" target="_blank" rel="noopener">
          <img :src="item.logo" :alt="item.name" loading="lazy" />
        </a>
      </div>
    </div>
    <div v-if="bronze.length > 0" class="bronze">
      <h3>Bronze Sponsors</h3>
      <div class="list">
        <a v-for="item in bronze" :href="item.link" :title="formatAmount(item.amount) + ' by ' + item.name" target="_blank" rel="noopener">
          <img :src="item.logo" :alt="item.name" loading="lazy" />
        </a>
      </div>
    </div>
    <div v-if="backer.length > 0" class="backer">
      <h3>Individual Backers</h3>
      <div class="list">
        <a v-for="item in backer" :href="item.link" :title="formatAmount(item.amount) + ' by ' + item.name" target="_blank" rel="noopener">
          <img :src="item.logo" :alt="item.name" loading="lazy" />
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import sponsors from '../../../data/sponsors.json'
import tiers from '../../../data/tiers.json'

export default {
  name: 'Sponsors',

  data() {
    const data = {}
    Object.keys(tiers).forEach(tierId => {
      data[tierId] = this[tierId]
    })
    return data
  },

  beforeCreate() {
    let lastAmount = Infinity
    Object.keys(tiers).forEach(tierId => {
      const tier = tiers[tierId]
      this[tierId] = sponsors.filter(item => item.amount >= tier.minAmount && item.amount < lastAmount)
      lastAmount = tier.minAmount
    })
  },

  methods: {
    formatAmount(amount) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0
      }).format(amount)
    }
  }
}
</script>

<style scoped>
.sponsors {
  border: 1px solid #eaecef;
  background: #fff;
  padding: 0 0.5rem 1.5rem;
}
.sponsors h3 {
  text-align: center;
  border: 0;
}
.sponsors .list {
  text-align: center;
}
.sponsors .list a {
  display: inline-block;
  box-sizing: border-box;
  position: relative;
  top: 0;
  transition: top 100ms;
}
.sponsors .list img {
  overflow: hidden;
}
.sponsors .list a:hover {
  top: -4px;
}
.sponsors .platinum .list img {
  height: 80px;
}
.sponsors .platinum .list a {
  padding: 0.5rem;
}
.sponsors .gold .list img {
  height: 64px;
}
.sponsors .gold .list a {
  padding: 0.5rem;
}
.sponsors .silver .list img {
  height: 48px;
}
.sponsors .silver .list a {
  padding: 0.4rem;
}
.sponsors .bronze .list img {
  height: 36px;
}
.sponsors .bronze .list a {
  padding: 0.3rem;
}
.sponsors .backer .list img {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid #fff;
  box-shadow: 0 0 0 1px #007acc;
}
.sponsors .backer .list a {
  padding: 0.15rem;
}
</style>
