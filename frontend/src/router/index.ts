import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { usePermissionsStore, ResourceType, PermissionAction } from '@/stores/permissions'

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
      meta: { requiresAuth: true, resource: ResourceType.DASHBOARD }
    },
    {
      path: '/market',
      name: 'PluginMarket',
      component: () => import('@/views/PluginMarket.vue'),
      meta: { requiresAuth: true, resource: ResourceType.MARKET }
    },
    {
      path: '/market/:id',
      name: 'PluginMarketDetail',
      component: () => import('@/views/PluginMarketDetail.vue'),
      meta: { requiresAuth: true, resource: ResourceType.MARKET }
    },
    {
      path: '/plugins',
      name: 'InstalledPlugins',
      component: () => import('@/views/InstalledPlugins.vue'),
      meta: { requiresAuth: true, resource: ResourceType.PLUGINS }
    },
    {
      path: '/plugins/:slug',
      name: 'PluginView',
      component: () => import('@/views/PluginView.vue'),
      meta: { requiresAuth: true, resource: ResourceType.PLUGINS }
    },
    {
      path: '/plugins/:slug/:subpath(.*)',
      name: 'PluginSubView',
      component: () => import('@/views/PluginView.vue'),
      meta: { requiresAuth: true, resource: ResourceType.PLUGINS }
    },
    {
      path: '/users',
      name: 'Users',
      component: () => import('@/views/Users.vue'),
      meta: { requiresAuth: true, requiresAdmin: true, resource: ResourceType.USERS }
    },
    {
      path: '/profile',
      name: 'Profile',
      component: () => import('@/views/Profile.vue'),
      meta: { requiresAuth: true, resource: ResourceType.PROFILE }
    },
    {
      path: '/settings',
      name: 'Settings',
      component: () => import('@/views/Settings.vue'),
      meta: { requiresAuth: true, resource: ResourceType.SETTINGS }
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  const permissionsStore = usePermissionsStore()
  
  // Si hay token pero no hay usuario, intentar inicializar
  if (authStore.token && !authStore.user) {
    try {
      await authStore.initializeAuth()
    } catch (error) {
      console.error('Failed to initialize auth:', error)
    }
  }
  
  // Check authentication
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return next('/login')
  }
  
  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    return next('/dashboard')
  }
  
  // Check admin requirement (legacy support)
  if (to.meta.requiresAdmin && !authStore.isAdmin) {
    return next('/dashboard')
  }
  
  // Check resource-based permissions
  if (to.meta.resource && authStore.user) {
    const resource = to.meta.resource as ResourceType
    const userRole = authStore.user.role
    
    // Load permissions if not loaded yet
    if (permissionsStore.permissions.length === 0) {
      try {
        await permissionsStore.fetchPermissions()
      } catch (error) {
        console.error('Failed to load permissions:', error)
        // Allow navigation if permissions can't be loaded (fail-open for better UX)
        return next()
      }
    }
    
    // Check if user has VIEW permission for this resource
    const hasPermission = permissionsStore.hasPermission(
      userRole,
      resource,
      PermissionAction.VIEW
    )
    
    if (!hasPermission) {
      console.warn(`User ${userRole} does not have VIEW permission for ${resource}`)
      return next('/dashboard')
    }
  }
  
  next()
})

export default router
