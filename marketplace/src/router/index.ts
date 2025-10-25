import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('@/views/Home.vue')
    },
    {
      path: '/plugins',
      name: 'Plugins',
      component: () => import('@/views/Plugins.vue')
    },
    {
      path: '/plugins/:id',
      name: 'PluginDetail',
      component: () => import('@/views/PluginDetail.vue')
    },
    {
      path: '/categories',
      name: 'Categories',
      component: () => import('@/views/Categories.vue')
    },
    {
      path: '/about',
      name: 'About',
      component: () => import('@/views/About.vue')
    }
  ]
})

export default router