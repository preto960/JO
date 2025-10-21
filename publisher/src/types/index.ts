export interface User {
  id: string
  email: string
  username: string
  role: 'USER' | 'DEVELOPER' | 'ADMIN'
  createdAt: string
}

export interface Plugin {
  id: string
  title: string
  description: string
  version: string
  price: number
  category: string
  tags: string[]
  downloadUrl?: string
  demoUrl?: string
  githubUrl?: string
  status: 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED'
  createdAt: string
  updatedAt: string
  author: {
    id: string
    username: string
  }
  avgRating: number
  _count: {
    reviews: number
    purchases: number
  }
}

export interface Analytics {
  totalRevenue: number
  totalSales: number
  totalPlugins: number
  avgRating: number
  dailyStats: Array<{
    date: string
    downloads: number
    revenue: number
    views: number
  }>
  pluginStats: Array<{
    pluginId: string
    pluginTitle: string
    downloads: number
    revenue: number
    rating: number
  }>
}

export interface AuthResponse {
  user: User
  token: string
}