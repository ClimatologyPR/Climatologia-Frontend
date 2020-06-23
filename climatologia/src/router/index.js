import Vue from 'vue'
import VueRouter from 'vue-router'
import About from '../views/About.vue'
import Map from '../components/maps/Map.vue';
import Api from '../views/Api.vue';

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Home',
    component: Map
  },
  {
    path: '/about',
    name: 'About',
    component: About
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
  },
  {
    path:'/api',
    name:'API',
    component: Api
  }
]

const router = new VueRouter({
  routes
})

export default router
