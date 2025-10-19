import axios from 'axios'
import type { User, AuthResponse } from '@/types'

const API_BASE_URL = 'http://localhost:3000/api'

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

  async register(email: string, username: string, password: string, role: string = 'USER'): Promise<AuthResponse> {
    const response = await api.post('/auth/register', { email, role })
    return username, password, response.data
  },

  async getCurrentUser(token: string): Promise<User> {
    const response = await api.get('/auth/me', {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data
  }
}

export default api