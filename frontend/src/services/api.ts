import axios from 'axios'
import type { User, AuthResponse } from '@/types'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const authApi = {
  async login(login: string, password: string): Promise<AuthResponse> {
    const response = await api.post('/auth/login', { login, password })
    return response.data
  },

  async register(email: string, username: string, password: string, firstName: string, lastName: string, role: string = 'USER'): Promise<AuthResponse> {
    const response = await api.post('/auth/register', { email, username, password, firstName, lastName, role })
    return response.data
  },

  async getCurrentUser(token: string): Promise<User> {
    const response = await api.get('/auth/profile', {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data.user
  },

  async updateProfile(profileData: Partial<User>): Promise<{message: string, user: User}> {
    const response = await api.put('/auth/profile', profileData)
    return response.data
  }
}

export const pluginsApi = {
  async getPlugins(params?: any) {
    const response = await api.get('/plugins', { params })
    return response.data
  },

  async getPlugin(id: string) {
    const response = await api.get(`/plugins/${id}`)
    return response.data
  }
}

export default api