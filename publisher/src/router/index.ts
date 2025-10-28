import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/dashboard'
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/Login.vue'),
      meta: { requiresGuest: true }
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: () => import('@/views/Dashboard.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/plugins',
      name: 'MyPlugins',
      component: () => import('@/views/MyPlugins.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/local-plugins',
      name: 'LocalPlugins',
      component: () => import('@/views/LocalPlugins.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/plugins/create',
      name: 'CreatePlugin',
      component: () => import('@/views/CreatePlugin.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/plugins/:id/edit',
      name: 'EditPlugin',
      component: () => import('@/views/EditPlugin.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/analytics',
      name: 'Analytics',
      component: () => import('@/views/Analytics.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/settings',
      name: 'Settings',
      component: () => import('@/views/Settings.vue'),
      meta: { requiresAuth: true }
    }
  ]
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router