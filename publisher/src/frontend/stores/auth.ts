import { defineStore } from 'pinia'
import api from '@/services/api'

interface User {
  id: string
  email: string
  name: string
  type: 'publisher'
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    token: localStorage.getItem('token') || null,
    isLoading: false,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
  },

  actions: {
    async login(email: string, password: string) {
      try {
        this.isLoading = true
        const response = await api.post('/auth/login', { email, password })
        const { token, user } = response.data
        
        this.token = token
        this.user = user
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(user))
        
        return { success: true }
      } catch (error: any) {
        return { 
          success: false, 
          error: error.response?.data?.error || 'Login failed' 
        }
      } finally {
        this.isLoading = false
      }
    },

    async register(email: string, name: string, password: string) {
      try {
        this.isLoading = true
        const response = await api.post('/auth/register', { email, name, password })
        const { token, user } = response.data
        
        this.token = token
        this.user = user
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(user))
        
        return { success: true }
      } catch (error: any) {
        return { 
          success: false, 
          error: error.response?.data?.error || 'Registration failed' 
        }
      } finally {
        this.isLoading = false
      }
    },

    logout() {
      this.user = null
      this.token = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    },

    initializeAuth() {
      const token = localStorage.getItem('token')
      const userStr = localStorage.getItem('user')
      
      if (token && userStr) {
        this.token = token
        this.user = JSON.parse(userStr)
      }
    },
  },
})