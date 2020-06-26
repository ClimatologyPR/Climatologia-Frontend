import Vue from 'vue'
import VueRouter from 'vue-router'
import About from '../views/About.vue'
import Map from '../components/maps/Map.vue';
import Api from '../views/Api.vue';
import Graph from '../components/Graph.vue';
import Docs from '../views/Docs.vue'

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
  },
  {
    path:'/api',
    name:'API',
    component: Api
  },
  {
    path: '/graph/:varType/:modalId/:spanClass/:chartType/:labelName/:stationID/:municipality/:startdate/:enddate/:max/:min/:des/:err/:avg',
    name:'graph',
    component: Graph,
  },
  {
    path: '/documents',
    name: 'Docs',
    component: Docs
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to,from,next)=>{
  if(!(to.name === 'Home' && from.name == 'graph')){
    next();
  }
});

export default router
