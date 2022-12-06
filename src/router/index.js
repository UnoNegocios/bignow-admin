import Vue from 'vue'
import VueRouter from 'vue-router'
import Dashboard from '../components/Dashboard.vue'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard
  },
  {
    path: '/calendar',
    name: 'Calendar',
    component: () => import('../components/activities/calendar.vue')
  },
  {
    path: '/clients',
    name: 'Clients',
    component: () => import('../components/clients/container.vue')
  },
  {
    path: '/videos',
    name: 'Videos',
    component: () => import('../components/videos/container.vue')
  },
  {
    path: '/videos/:id',
    name: 'Videos por Catgeoría',
    component: () => import('../components/videos/videos_by_category.vue')
  },
  {
    path:'/training',
    name:'Training',
    component: () => import('../components/training/container.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
