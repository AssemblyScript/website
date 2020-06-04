<template>
  <div class="testimonials">
    <div v-for="item in testimonials" class="testimonial">
      <img class="logo" :src="'avatars/' + item.name.replace(/ /g, '_') + '.png'" :alt="item.name" />
      <p>“{{ item.text }}” – <strong>{{ item.name }}</strong>, <a :href="item.link" target="_blank" rel="noopener">{{ item.title }}</a></p>
    </div>
  </div>
</template>

<script>
import testimonials from '../../../data/testimonials.json'

export default {
  data() {
    return {
      testimonials
    }
  }
}
</script>

<style scoped>
.testimonials {
  padding-bottom: 1rem;
}
.testimonials h3 {
  text-align: center;
  border: 0;
}
.testimonial {
  position: relative;
  padding: 1rem 0;
}
.testimonial .logo {
  position: absolute;
  left: 30px;
  top: 20px;
  border-radius: 50%;
  width: 64px;
  height: 64px;
  border: 1px solid #fff;
  box-shadow: 0 0 0 1px #007acc;
}
.testimonial p {
  margin: 0 40px 0 110px;
  text-align: justify;
}
@media only screen and (max-width: 720px) {
  .testimonial .logo {
    position: relative;
    float: left;
    top: 3px;
    left: 0;
    right: 0;
    width: 48px;
    height: 48px;
    margin: 0 10px 0 0;
  }
  .testimonial p {
    margin: 0;
  }
}
</style>
