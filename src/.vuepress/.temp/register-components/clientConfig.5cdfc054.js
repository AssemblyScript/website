import { defineAsyncComponent } from 'vue'

export default {
  enhance: ({ app }) => {    
      app.component("Ch", defineAsyncComponent(() => import("/Volumes/Archive/Projects/Github/website/src/.vuepress/components/Ch.vue")))
    
      app.component("Community", defineAsyncComponent(() => import("/Volumes/Archive/Projects/Github/website/src/.vuepress/components/Community.vue")))
    
      app.component("Contributors", defineAsyncComponent(() => import("/Volumes/Archive/Projects/Github/website/src/.vuepress/components/Contributors.vue")))
    
      app.component("Fi", defineAsyncComponent(() => import("/Volumes/Archive/Projects/Github/website/src/.vuepress/components/Fi.vue")))
    
      app.component("No", defineAsyncComponent(() => import("/Volumes/Archive/Projects/Github/website/src/.vuepress/components/No.vue")))
    
      app.component("Sa", defineAsyncComponent(() => import("/Volumes/Archive/Projects/Github/website/src/.vuepress/components/Sa.vue")))
    
      app.component("Sponsors", defineAsyncComponent(() => import("/Volumes/Archive/Projects/Github/website/src/.vuepress/components/Sponsors.vue")))
    
      app.component("Testimonials", defineAsyncComponent(() => import("/Volumes/Archive/Projects/Github/website/src/.vuepress/components/Testimonials.vue")))
    
      app.component("Ws", defineAsyncComponent(() => import("/Volumes/Archive/Projects/Github/website/src/.vuepress/components/Ws.vue")))
    
      app.component("Wt", defineAsyncComponent(() => import("/Volumes/Archive/Projects/Github/website/src/.vuepress/components/Wt.vue")))
    
      app.component("Xx", defineAsyncComponent(() => import("/Volumes/Archive/Projects/Github/website/src/.vuepress/components/Xx.vue")))
  },
}
