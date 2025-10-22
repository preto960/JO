import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useSettingsStore } from '@/stores/settings'
import SidebarLayout from '@/layouts/SidebarLayout.vue'
import Dashboard from '@/views/Dashboard.vue'
import Plugins from '@/views/Plugins.vue'
import PublishPlugin from '@/views/PublishPlugin.vue'
import Analytics from '@/views/Analytics.vue'
import Settings from '@/views/Settings.vue'
import Profile from '@/views/Profile.vue'
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
      path: '/publish',
      name: 'PublishPlugin',
      component: SidebarLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          component: PublishPlugin
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
      component: SidebarLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          component: Settings
        }
      ]
    },
    {
      path: '/profile',
      name: 'Profile',
      component: SidebarLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          component: Profile
        }
      ]
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
  const settingsStore = useSettingsStore()
  
  // Load settings to check registration status
  settingsStore.loadSettings()
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (to.name === 'Register' && !settingsStore.isRegistrationAllowed) {
    // Redirect to login if registration is disabled
    next('/login')
  } else {
    next()
  }
})

export default router