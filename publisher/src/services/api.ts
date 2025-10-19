import axios from 'axios'
import type { User, AuthResponse } from '@/types'

const API_BASE_URL = '/api'

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
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await api.post('/auth/login', { email, password })
    return response.data
  },

  async register(email: string, username: string, password: string, role: string = 'DEVELOPER'): Promise<AuthResponse> {
    const response = await api.post('/auth/register', { email, username, password, role })
    return response.data
  }
}

export const pluginsApi = {
  async getPlugins() {
    const response = await api.get('/plugins')
    return response.data
  },

  async getPlugin(id: string) {
    const response = await api.get(`/plugins/${id}`)
    return response.data
  },

  async createPlugin(pluginData: any) {
    const response = await api.post('/plugins', pluginData)
    return response.data
  },

  async updatePlugin(id: string, pluginData: any) {
    const response = await api.put(`/plugins/${id}`, pluginData)
    return response.data
  },

  async deletePlugin(id: string) {
    const response = await api.delete(`/plugins/${id}`)
    return response.data
  }
}

export default api