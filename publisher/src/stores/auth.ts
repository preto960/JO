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
  bio?: string
  website?: string
  github?: string
  twitter?: string
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('accessToken'))
  const refreshTokenValue = ref<string | null>(localStorage.getItem('refreshToken'))
  const loading = ref(false)

  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const isDeveloper = computed(() => user.value?.role === 'DEVELOPER' || user.value?.role === 'ADMIN')
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

  const register = async (userData: {
    email: string
    password: string
    firstName: string
    lastName: string
    role?: string
  }) => {
    loading.value = true
    try {
      const response = await api.post('/auth/register', userData)
      const { user: newUser, accessToken, refreshToken } = response.data
      
      user.value = newUser
      token.value = accessToken
      refreshTokenValue.value = refreshToken
      
      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('refreshToken', refreshToken)
      
      return { success: true }
    } catch (error: any) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed' 
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

  const updateProfile = async (profileData: Partial<User>) => {
    try {
      const response = await api.put('/auth/profile', profileData)
      user.value = response.data.user
      return { success: true }
    } catch (error: any) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Profile update failed' 
      }
    }
  }

  // Initialize auth state
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
    isDeveloper,
    isAdmin,
    login,
    register,
    logout,
    refreshToken,
    fetchProfile,
    updateProfile,
    initializeAuth
  }
})