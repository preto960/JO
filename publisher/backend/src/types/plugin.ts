export interface PluginManifest {
  name: string;
  version: string;
  slug: string;
  description: string;
  longDescription?: string;
  author: string;
  category: string;
  
  // Entry points
  main?: string;
  frontend?: {
    entry: string;
    routes?: PluginRoute[];
    components?: Record<string, string>;
    store?: string;
  };
  backend?: {
    entry: string;
    routes?: string;
    models?: string[];
  };
  
  // Metadata
  icon?: string;
  screenshots?: string[];
  tags?: string[];
  license?: string;
  homepage?: string;
  repository?: string;
  
  // Requirements
  engines?: {
    node?: string;
    npm?: string;
  };
  dependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
  
  // Permissions
  permissions?: string[];
  
  // Settings
  settings?: PluginSetting[];
  
  // Lifecycle hooks
  hooks?: {
    onInstall?: string;
    onActivate?: string;
    onDeactivate?: string;
    onUninstall?: string;
    onUpdate?: string;
  };
}

export interface PluginRoute {
  path: string;
  name: string;
  component: string;
  meta?: {
    title?: string;
    icon?: string;
    requiresAuth?: boolean;
    requiresAdmin?: boolean;
    [key: string]: any;
  };
}

export interface PluginSetting {
  key: string;
  label: string;
  type: 'text' | 'number' | 'boolean' | 'select' | 'textarea' | 'password';
  description?: string;
  default?: any;
  required?: boolean;
  options?: Array<{ label: string; value: any }>;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
}

export interface LocalPlugin {
  path: string;
  manifest: PluginManifest;
  packageJson?: any;
  isValid: boolean;
  errors: string[];
  size?: number;
  files?: string[];
}

export interface PluginBuildResult {
  success: boolean;
  pluginSlug: string;
  version: string;
  outputPath?: string;
  zipPath?: string;
  blobUrl?: string;
  size?: number;
  checksum?: string;
  errors?: string[];
}

export interface PluginValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}



