import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useSettingsStore } from '@/stores/settings'
import Login from '@/views/Login.vue'
import Register from '@/views/Register.vue'
import Dashboard from '@/views/Dashboard.vue'
import Settings from '@/views/Settings.vue'
import Marketplace from '@/views/Marketplace.vue'
import Profile from '@/views/Profile.vue'
import MyPlugins from '@/views/MyPlugins.vue'
import SidebarLayout from '@/layouts/SidebarLayout.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/login'
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
      path: '/marketplace',
      name: 'Marketplace',
      component: SidebarLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          component: Marketplace
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
      path: '/my-plugins',
      name: 'MyPlugins',
      component: SidebarLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          component: MyPlugins
        }
      ]
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