import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/torpedo.vue'
import About from './views/About.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'torpedo',
      component: Home
    },
    {
      path: '/about',
      name: 'about',
      component: About
    }
  ]
})
