import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('publisher_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('publisher_token')
      localStorage.removeItem('publisher_user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const authAPI = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password })
    return response.data
  },
  
  register: async (email, name, password) => {
    const response = await api.post('/auth/register', { email, name, password })
    return response.data
  },
  
  verify: async () => {
    const response = await api.get('/auth/verify')
    return response.data
  }
}

export const pluginsAPI = {
  getAll: async () => {
    const response = await api.get('/plugins')
    return response.data
  },
  
  getById: async (id) => {
    const response = await api.get(`/plugins/${id}`)
    return response.data
  },
  
  create: async (pluginData) => {
    const response = await api.post('/plugins', pluginData)
    return response.data
  },
  
  update: async (id, pluginData) => {
    const response = await api.put(`/plugins/${id}`, pluginData)
    return response.data
  },
  
  delete: async (id) => {
    const response = await api.delete(`/plugins/${id}`)
    return response.data
  }
}

export const analyticsAPI = {
  getDashboard: async () => {
    const response = await api.get('/analytics')
    return response.data
  },
  
  getPluginAnalytics: async (pluginId) => {
    const response = await api.get(`/analytics/plugin/${pluginId}`)
    return response.data
  }
}

export default api