export interface User {
  id: string
  email: string
  username: string
  role: 'USER' | 'DEVELOPER' | 'ADMIN'
  firstName?: string
  lastName?: string
  bio?: string
  website?: string
  location?: string
  githubUrl?: string
  twitterUrl?: string
  linkedinUrl?: string
  avatar?: string
  createdAt: string
  updatedAt?: string
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

export interface Review {
  id: string
  userId: string
  pluginId: string
  rating: number
  comment?: string
  createdAt: string
  user: {
    id: string
    username: string
  }
}

export interface Purchase {
  id: string
  userId: string
  pluginId: string
  amount: number
  status: string
  createdAt: string
  plugin: {
    id: string
    title: string
    price: number
  }
}

export interface AuthResponse {
  user: User
  token: string
}

export interface PluginsResponse {
  plugins: Plugin[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}