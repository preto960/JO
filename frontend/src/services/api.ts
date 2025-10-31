import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'vue-toastification'
import router from '@/router'

const toast = useToast()

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api`,
  timeout: 10000,
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore()
    if (authStore.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const authStore = useAuthStore()
    
    // Only attempt token refresh if:
    // 1. Status is 401
    // 2. Not already retried
    // 3. User is authenticated (has a refresh token)
    // 4. Not a public endpoint
    const isPublicEndpoint = error.config?.url?.includes('/public') || 
                             error.config?.url?.includes('/login') ||
                             error.config?.url?.includes('/register')
    
    if (error.response?.status === 401 && 
        !error.config._retry && 
        authStore.isAuthenticated &&
        !isPublicEndpoint) {
      error.config._retry = true
      
      try {
        await authStore.refreshToken()
        return api.request(error.config)
      } catch (refreshError) {
        authStore.logout()
        router.push('/login')
        return Promise.reject(refreshError)
      }
    }
    
    // Show error toast only if not a public endpoint 401
    if (!(error.response?.status === 401 && isPublicEndpoint)) {
      const message = error.response?.data?.message || 'An error occurred'
      toast.error(message)
    }
    
    return Promise.reject(error)
  }
)

export default api

