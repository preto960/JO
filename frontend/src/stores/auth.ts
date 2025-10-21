import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authApi } from '@/services/api'
import type { User, AuthResponse } from '@/types'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => !!token.value && !!user.value)

  const login = async (email: string, password: string): Promise<boolean> => {
    loading.value = true
    error.value = null
    
    try {
      const response: AuthResponse = await authApi.login(email, password)
      user.value = response.user
      token.value = response.token
      
      localStorage.setItem('token', response.token)
      localStorage.setItem('user', JSON.stringify(response.user))
      
      return true
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Login failed'
      return false
    } finally {
      loading.value = false
    }
  }

  const register = async (email: string, username: string, password: string, role: string = 'USER'): Promise<boolean> => {
    loading.value = true
    error.value = null
    
    try {
      const response: AuthResponse = await authApi.register(email, username, password, role)
      user.value = response.user
      token.value = response.token
      
      localStorage.setItem('token', response.token)
      localStorage.setItem('user', JSON.stringify(response.user))
      
      return true
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Registration failed'
      return false
    } finally {
      loading.value = false
    }
  }

  const logout = () => {
    user.value = null
    token.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  const loadUserFromStorage = () => {
    const storedToken = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')
    
    if (storedToken && storedUser) {
      token.value = storedToken
      user.value = JSON.parse(storedUser)
    }
  }

  const updateProfile = async (profileData: Partial<User>): Promise<boolean> => {
    loading.value = true
    error.value = null
    
    try {
      const response: {message: string, user: User} = await authApi.updateProfile(profileData)
      user.value = response.user
      
      // Update localStorage with new user data
      localStorage.setItem('user', JSON.stringify(response.user))
      
      return true
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Profile update failed'
      return false
    } finally {
      loading.value = false
    }
  }

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    login,
    register,
    logout,
    loadUserFromStorage,
    updateProfile
  }
})