export interface Profile {
  id: string
  firstName: string
  lastName: string
  bio?: string
  avatar?: string
  website?: string
  github?: string
  paypalEmail?: string
  phone?: string
  location?: string
  birthDate?: string
  isPublic: boolean
  createdAt: string
  updatedAt: string
  fullName?: string
}

export interface User {
  id: string
  email: string
  username: string
  role: 'USER' | 'DEVELOPER' | 'ADMIN' | 'PUBLISHER'
  isActive: boolean
  lastLoginAt?: string
  createdAt: string
  updatedAt: string
  profile?: Profile
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