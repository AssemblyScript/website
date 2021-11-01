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
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 1.5rem 0;
}
.testimonial:nth-child(even) {
  flex-direction: row-reverse;
}
.testimonial .logo {
  border-radius: 50%;
  width: 80px;
  height: 80px;
  border: 1px solid #fff;
  box-shadow: 0 0 0 1px #007acc;
}
.testimonial p {
  margin: 0 0 0 40px;
  text-align: justify;
}
.testimonial:nth-child(even) p {
  margin: 0 40px 0 0;
  text-align-last: right;
}
@media only screen and (max-width: 720px) {
  .testimonial {
    flex-direction: column;
  }
  .testimonial:nth-child(even) {
    flex-direction: column;
  }
  .testimonial .logo {
    width: 90px;
    height: 90px;
  }
  .testimonial p {
    margin: 30px 0 10px 0;
  }
  .testimonial:nth-child(even) p {
    margin: 30px 0 10px 0;
    text-align-last: initial;
  }
}
</style>
