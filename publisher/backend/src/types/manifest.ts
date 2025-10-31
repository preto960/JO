export interface PluginManifest {
  name: string
  version: string
  slug: string
  description: string
  longDescription?: string
  author: string
  category: string
  
  frontend?: {
    entry: string
    routes?: Array<{
      path: string
      name: string
      component: string
      meta?: {
        title?: string
        icon?: string
        requiresAuth?: boolean
      }
    }>
    components?: Record<string, string>
    store?: string
  }
  
  backend?: {
    entry: string
    routes?: string
    models?: string[]
  }
  
  icon?: string
  screenshots?: string[]
  tags?: string[]
  license?: string
  homepage?: string
  repository?: string
  
  permissions?: PluginPermission[]
  
  settings?: Array<{
    key: string
    label: string
    type: 'text' | 'number' | 'boolean' | 'select'
    description?: string
    default?: any
    required?: boolean
    options?: Array<{ label: string; value: any }>
  }>
  
  hooks?: {
    onInstall?: string
    onActivate?: string
    onDeactivate?: string
    onUninstall?: string
    onUpdate?: string
  }
  
  dependencies?: Record<string, string>
  minSystemVersion?: string
}

export interface PluginPermission {
  resource: string
  label: string
  description: string
  actions: ('view' | 'create' | 'edit' | 'delete')[]
  defaultRoles: {
    USER?: PermissionFlags
    DEVELOPER?: PermissionFlags
    ADMIN?: PermissionFlags
  }
}

export interface PermissionFlags {
  canView: boolean
  canCreate: boolean
  canEdit: boolean
  canDelete: boolean
}

