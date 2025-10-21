import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import SidebarLayout from '@/layouts/SidebarLayout.vue'
import Dashboard from '@/views/Dashboard.vue'
import Plugins from '@/views/Plugins.vue'
import Analytics from '@/views/Analytics.vue'
import Settings from '@/views/Settings.vue'
import Login from '@/views/Login.vue'
import Register from '@/views/Register.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/dashboard'
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: SidebarLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          component: Dashboard
        }
      ]
    },
    {
      path: '/plugins',
      name: 'Plugins',
      component: SidebarLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          component: Plugins
        }
      ]
    },
    {
      path: '/analytics',
      name: 'Analytics',
      component: SidebarLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          component: Analytics
        }
      ]
    },
    {
      path: '/settings',
      name: 'Settings',
      component: Settings,
      meta: { requiresAuth: true }
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/register',
      name: 'Register',
      component: Register
    }
  ]
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else {
    next()
  }
})

export default router