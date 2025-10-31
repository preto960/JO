import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/api'

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: string
  avatar?: string
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('accessToken'))
  const refreshTokenValue = ref<string | null>(localStorage.getItem('refreshToken'))
  const loading = ref(false)

  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const isAdmin = computed(() => user.value?.role === 'ADMIN')

  const login = async (email: string, password: string) => {
    loading.value = true
    try {
      const response = await api.post('/auth/login', { email, password })
      const { user: userData, accessToken, refreshToken } = response.data
      
      user.value = userData
      token.value = accessToken
      refreshTokenValue.value = refreshToken
      
      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('refreshToken', refreshToken)
      
      return { success: true }
    } catch (error: any) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      }
    } finally {
      loading.value = false
    }
  }

  const logout = () => {
    user.value = null
    token.value = null
    refreshTokenValue.value = null
    
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('app_settings') // Clear settings cache
  }

  const refreshToken = async () => {
    if (!refreshTokenValue.value) {
      throw new Error('No refresh token available')
    }
    
    try {
      const response = await api.post('/auth/refresh', {
        refreshToken: refreshTokenValue.value
      })
      
      const { accessToken, refreshToken } = response.data
      
      token.value = accessToken
      refreshTokenValue.value = refreshToken
      
      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('refreshToken', refreshToken)
    } catch (error) {
      logout()
      throw error
    }
  }

  const fetchProfile = async () => {
    try {
      const response = await api.get('/auth/profile')
      user.value = response.data.user
    } catch (error) {
      logout()
    }
  }

  const initializeAuth = async () => {
    if (token.value) {
      await fetchProfile()
    }
  }

  return {
    user,
    token,
    loading,
    isAuthenticated,
    isAdmin,
    login,
    logout,
    refreshToken,
    fetchProfile,
    initializeAuth
  }
})

