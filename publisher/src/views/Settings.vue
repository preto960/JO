<template>
  <div class="p-6">
    <!-- Header -->
    <div class="mb-8">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Site Settings</h1>
          <p class="text-gray-600 dark:text-gray-400 mt-2">Manage global site configuration and preferences</p>
        </div>
        <ThemeToggle />
      </div>
    </div>

    <div class="grid xl:grid-cols-3 gap-8">
      <!-- Main Settings Content -->
      <div class="xl:col-span-2 space-y-8">
        <!-- General Settings Card -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div class="p-6 border-b border-gray-200 dark:border-gray-700">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
              </div>
              <div>
                <h2 class="text-xl font-semibold text-gray-900 dark:text-white">General Settings</h2>
                <p class="text-sm text-gray-600 dark:text-gray-400">Basic site configuration</p>
              </div>
            </div>
          </div>
          <div class="p-6">
            <form @submit.prevent="updateGeneralSettings" class="space-y-6">
              <div class="grid md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Site Name</label>
                  <div class="relative">
                    <input
                      v-model="generalForm.siteName"
                      type="text"
                      required
                      class="w-full px-4 py-3 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                    />
                    <svg class="absolute left-3 top-3.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path>
                    </svg>
                  </div>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Site URL</label>
                  <div class="relative">
                    <input
                      v-model="generalForm.siteUrl"
                      type="url"
                      required
                      class="w-full px-4 py-3 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                      placeholder="https://example.com"
                    />
                    <svg class="absolute left-3 top-3.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
                    </svg>
                  </div>
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Site Description</label>
                <textarea
                  v-model="generalForm.siteDescription"
                  rows="3"
                  class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all resize-none"
                  placeholder="Brief description of your site..."
                ></textarea>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Default Language</label>
                <select
                  v-model="generalForm.defaultLanguage"
                  class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                >
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                  <option value="de">Deutsch</option>
                  <option value="pt">Português</option>
                </select>
              </div>
              
              <div class="flex justify-end pt-4">
                <button
                  type="submit"
                  :disabled="saving"
                  class="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
                >
                  <span v-if="saving" class="flex items-center">
                    <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </span>
                  <span v-else>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Categories Settings Card -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div class="p-6 border-b border-gray-200 dark:border-gray-700">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                  <svg class="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                  </svg>
                </div>
                <div>
                  <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Plugin Categories</h2>
                  <p class="text-sm text-gray-600 dark:text-gray-400">Manage plugin categories</p>
                </div>
              </div>
              <button
                @click="showAddCategoryModal = true"
                class="px-4 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
              >
                Add Category
              </button>
            </div>
          </div>
          <div class="p-6">
            <div class="space-y-3">
              <div
                v-for="category in categories"
                :key="category.id"
                class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div class="flex items-center space-x-3">
                  <div
                    class="w-4 h-4 rounded-full"
                    :style="{ backgroundColor: category.color }"
                  ></div>
                  <div>
                    <h3 class="font-medium text-gray-900 dark:text-white">{{ category.name }}</h3>
                    <p class="text-sm text-gray-500 dark:text-gray-400">{{ category.description }}</p>
                  </div>
                </div>
                <div class="flex items-center space-x-2">
                  <span class="text-sm text-gray-500 dark:text-gray-400">{{ category.pluginCount }} plugins</span>
                  <button
                    @click="editCategory(category)"
                    class="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                  </button>
                  <button
                    @click="deleteCategory(category.id)"
                    class="p-2 text-red-500 hover:text-red-700"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Security Settings Card -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div class="p-6 border-b border-gray-200 dark:border-gray-700">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
              </div>
              <div>
                <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Security Settings</h2>
                <p class="text-sm text-gray-600 dark:text-gray-400">Global security configuration</p>
              </div>
            </div>
          </div>
          <div class="p-6">
            <form @submit.prevent="updateSecuritySettings" class="space-y-6">
              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <div>
                    <h3 class="font-medium text-gray-900 dark:text-white">User Registration</h3>
                    <p class="text-sm text-gray-500 dark:text-gray-400">Allow new users to register</p>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input
                      v-model="securityForm.allowRegistration"
                      type="checkbox"
                      class="sr-only peer"
                    />
                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div class="flex items-center justify-between">
                  <div>
                    <h3 class="font-medium text-gray-900 dark:text-white">Email Verification</h3>
                    <p class="text-sm text-gray-500 dark:text-gray-400">Require email verification for new accounts</p>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input
                      v-model="securityForm.requireEmailVerification"
                      type="checkbox"
                      class="sr-only peer"
                    />
                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div class="flex items-center justify-between">
                  <div>
                    <h3 class="font-medium text-gray-900 dark:text-white">Plugin Approval</h3>
                    <p class="text-sm text-gray-500 dark:text-gray-400">Require admin approval for new plugins</p>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input
                      v-model="securityForm.requirePluginApproval"
                      type="checkbox"
                      class="sr-only peer"
                    />
                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
              
              <div class="flex justify-end pt-4">
                <button
                  type="submit"
                  :disabled="savingSecurity"
                  class="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
                >
                  <span v-if="savingSecurity" class="flex items-center">
                    <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </span>
                  <span v-else>Save Security Settings</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- Sidebar -->
      <div class="xl:col-span-1 space-y-6">
        <!-- Site Stats Card -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div class="p-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-6">Site Statistics</h3>
            <div class="space-y-4">
              <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div class="flex items-center space-x-3">
                  <div class="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                    <svg class="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                    </svg>
                  </div>
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Total Users</span>
                </div>
                <span class="text-sm font-semibold text-gray-900 dark:text-white">{{ siteStats.totalUsers }}</span>
              </div>
              
              <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div class="flex items-center space-x-3">
                  <div class="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                    <svg class="w-4 h-4 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                    </svg>
                  </div>
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Total Plugins</span>
                </div>
                <span class="text-sm font-semibold text-gray-900 dark:text-white">{{ siteStats.totalPlugins }}</span>
              </div>
              
              <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div class="flex items-center space-x-3">
                  <div class="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                    <svg class="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                    </svg>
                  </div>
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Total Downloads</span>
                </div>
                <span class="text-sm font-semibold text-gray-900 dark:text-white">{{ siteStats.totalDownloads }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Actions Card -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div class="p-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-6">Quick Actions</h3>
            <div class="space-y-3">
              <button
                @click="clearCache"
                class="w-full text-left px-4 py-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors flex items-center space-x-3"
              >
                <svg class="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Clear Cache</span>
              </button>
              
              <button
                @click="backupData"
                class="w-full text-left px-4 py-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors flex items-center space-x-3"
              >
                <svg class="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V2"></path>
                </svg>
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Backup Data</span>
              </button>
              
              <button
                @click="exportData"
                class="w-full text-left px-4 py-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors flex items-center space-x-3"
              >
                <svg class="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Export Data</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Category Modal -->
    <div
      v-if="showAddCategoryModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click="showAddCategoryModal = false"
    >
      <div
        class="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md"
        @click.stop
      >
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          {{ editingCategory ? 'Edit Category' : 'Add New Category' }}
        </h3>
        <form @submit.prevent="saveCategory" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Name</label>
            <input
              v-model="categoryForm.name"
              type="text"
              required
              class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
            <textarea
              v-model="categoryForm.description"
              rows="3"
              class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
            ></textarea>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Color</label>
            <input
              v-model="categoryForm.color"
              type="color"
              class="w-full h-10 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer"
            />
          </div>
          <div class="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              @click="showAddCategoryModal = false"
              class="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              {{ editingCategory ? 'Update' : 'Add' }} Category
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useToastStore } from '@/stores/toast'

const toastStore = useToastStore()

const saving = ref(false)
const savingSecurity = ref(false)
const showAddCategoryModal = ref(false)
const editingCategory = ref(null)

// General Settings Form
const generalForm = ref({
  siteName: 'Plugin Marketplace',
  siteUrl: 'https://plugins.example.com',
  siteDescription: 'A marketplace for discovering and sharing amazing plugins',
  defaultLanguage: 'en'
})

// Security Settings Form
const securityForm = ref({
  allowRegistration: true,
  requireEmailVerification: false,
  requirePluginApproval: true
})

// Category Form
const categoryForm = ref({
  name: '',
  description: '',
  color: '#6366f1'
})

// Categories Data
const categories = ref([
  {
    id: 1,
    name: 'Development',
    description: 'Tools for developers',
    color: '#3b82f6',
    pluginCount: 45
  },
  {
    id: 2,
    name: 'Design',
    description: 'Design and creative tools',
    color: '#8b5cf6',
    pluginCount: 23
  },
  {
    id: 3,
    name: 'Productivity',
    description: 'Boost your productivity',
    color: '#10b981',
    pluginCount: 67
  }
])

// Site Stats
const siteStats = ref({
  totalUsers: 1234,
  totalPlugins: 135,
  totalDownloads: 45678
})

const updateGeneralSettings = async () => {
  saving.value = true
  try {
    // TODO: Implement actual API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    toastStore.success('General settings updated successfully')
  } catch (error) {
    toastStore.error('Failed to update general settings')
  } finally {
    saving.value = false
  }
}

const updateSecuritySettings = async () => {
  savingSecurity.value = true
  try {
    // TODO: Implement actual API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    toastStore.success('Security settings updated successfully')
  } catch (error) {
    toastStore.error('Failed to update security settings')
  } finally {
    savingSecurity.value = false
  }
}

const editCategory = (category) => {
  editingCategory.value = category
  categoryForm.value = { ...category }
  showAddCategoryModal.value = true
}

const saveCategory = async () => {
  try {
    // TODO: Implement actual API call
    await new Promise(resolve => setTimeout(resolve, 500))
    
    if (editingCategory.value) {
      const index = categories.value.findIndex(c => c.id === editingCategory.value.id)
      if (index > -1) {
        categories.value[index] = { ...categoryForm.value, id: editingCategory.value.id }
      }
      toastStore.success('Category updated successfully')
    } else {
      categories.value.push({
        ...categoryForm.value,
        id: Date.now(),
        pluginCount: 0
      })
      toastStore.success('Category added successfully')
    }
    
    showAddCategoryModal.value = false
    resetCategoryForm()
  } catch (error) {
    toastStore.error('Failed to save category')
  }
}

const deleteCategory = async (id) => {
  if (!confirm('Are you sure you want to delete this category?')) return
  
  try {
    // TODO: Implement actual API call
    await new Promise(resolve => setTimeout(resolve, 500))
    categories.value = categories.value.filter(c => c.id !== id)
    toastStore.success('Category deleted successfully')
  } catch (error) {
    toastStore.error('Failed to delete category')
  }
}

const resetCategoryForm = () => {
  categoryForm.value = {
    name: '',
    description: '',
    color: '#6366f1'
  }
  editingCategory.value = null
}

const clearCache = () => {
  toastStore.success('Cache cleared successfully')
}

const backupData = () => {
  toastStore.success('Data backup initiated')
}

const exportData = () => {
  toastStore.success('Data export initiated')
}

onMounted(() => {
  // Load settings from API
})
</script>