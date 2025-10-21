<template>
  <div class="p-6">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
            <p class="text-gray-600 dark:text-gray-400 mt-2">Manage your publisher and site settings</p>
            <p class="text-sm text-gray-500 dark:text-gray-500 mt-1">Last updated: {{ new Date().toLocaleDateString() }}</p>
          </div>
        </div>
      </div>

      <div class="grid xl:grid-cols-3 gap-8">
        <!-- Main Settings Content -->
        <div class="xl:col-span-2 space-y-8">
          <!-- Payment Settings Card -->
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div class="p-6 border-b border-gray-200 dark:border-gray-700">
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                  <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                  </svg>
                </div>
                <div>
                  <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Payment Settings</h2>
                  <p class="text-sm text-gray-600 dark:text-gray-400">Configure your payment methods</p>
                </div>
              </div>
            </div>
            <div class="p-6">
              <form @submit.prevent="updatePaymentSettings" class="space-y-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">PayPal Email</label>
                  <div class="relative">
                    <input
                      v-model="paymentForm.paypalEmail"
                      type="email"
                      class="w-full px-4 py-3 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                      placeholder="paypal@example.com"
                    />
                    <svg class="absolute left-3 top-3.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                    </svg>
                  </div>
                  <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    This email will be used for receiving payments
                  </p>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Stripe Connect</label>
                  <div class="flex items-center space-x-4">
                    <button
                      type="button"
                      class="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105"
                    >
                      Connect with Stripe
                    </button>
                    <div v-if="paymentForm.stripeConnected" class="flex items-center text-green-600 dark:text-green-400">
                      <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      Connected
                    </div>
                  </div>
                  <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    Connect your Stripe account to receive payments
                  </p>
                </div>
                
                <div class="flex justify-end pt-4">
                  <button
                    type="submit"
                    :disabled="savingPayment"
                    class="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
                  >
                    <span v-if="savingPayment" class="flex items-center">
                      <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </span>
                    <span v-else>Save Payment Settings</span>
                  </button>
                </div>
              </form>
            </div>
          </div>

          <!-- Site Settings Card -->
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div class="p-6 border-b border-gray-200 dark:border-gray-700">
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                  <svg class="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                </div>
                <div>
                  <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Site Settings</h2>
                  <p class="text-sm text-gray-600 dark:text-gray-400">Configure your marketplace settings</p>
                </div>
              </div>
            </div>
            <div class="p-6">
              <form @submit.prevent="updateSiteSettings" class="space-y-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Site Name</label>
                  <div class="relative">
                    <input
                      v-model="siteForm.siteName"
                      type="text"
                      class="w-full px-4 py-3 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                      placeholder="Plugin Marketplace"
                    />
                    <svg class="absolute left-3 top-3.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path>
                    </svg>
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Commission Rate (%)</label>
                  <div class="relative">
                    <input
                      v-model="siteForm.commissionRate"
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      class="w-full px-4 py-3 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                      placeholder="10"
                    />
                    <svg class="absolute left-3 top-3.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    Percentage taken from each plugin sale
                  </p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Minimum Plugin Price ($)</label>
                  <div class="relative">
                    <input
                      v-model="siteForm.minPrice"
                      type="number"
                      min="0"
                      step="0.01"
                      class="w-full px-4 py-3 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                      placeholder="1.00"
                    />
                    <svg class="absolute left-3 top-3.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                </div>
                
                <div class="flex justify-end pt-4">
                  <button
                    type="submit"
                    :disabled="savingSite"
                    class="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
                  >
                    <span v-if="savingSite" class="flex items-center">
                      <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </span>
                    <span v-else>Save Site Settings</span>
                  </button>
                </div>
              </form>
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
                    <span v-else>Save Changes</span>
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
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                      </svg>
                    </div>
                    <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Total Users</span>
                  </div>
                  <span class="text-sm font-semibold text-gray-900 dark:text-white">{{ siteStats.totalUsers }}</span>
                </div>
                
                <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div class="flex items-center space-x-3">
                    <div class="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                      <svg class="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                      </svg>
                    </div>
                    <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Total Plugins</span>
                  </div>
<<<<<<< HEAD
                  <span class="text-sm font-semibold text-gray-900 dark:text-white">{{ user?.plugins?.length || 0 }}</span>
=======
                  <span class="text-sm font-semibold text-gray-900 dark:text-white">{{ siteStats.totalPlugins }}</span>
                </div>
                
                <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div class="flex items-center space-x-3">
                    <div class="w-8 h-8 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
                      <svg class="w-4 h-4 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    </div>
                    <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Total Revenue</span>
                  </div>
                  <span class="text-sm font-semibold text-gray-900 dark:text-white">${{ siteStats.totalRevenue }}</span>
>>>>>>> f0e09af1bceb11f4155c223dfbecef0e5c46821a
                </div>
              </div>
            </div>
          </div>
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> f0e09af1bceb11f4155c223dfbecef0e5c46821a

          <!-- Quick Actions Card -->
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div class="p-6">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-6">Quick Actions</h3>
              <div class="space-y-3">
                <button
                  @click="exportData"
                  class="w-full text-left px-4 py-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors flex items-center space-x-3"
                >
                  <svg class="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
<<<<<<< HEAD
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Export Data</span>
                </button>
                
                <button
                  @click="deleteAccount"
                  class="w-full text-left px-4 py-3 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors flex items-center space-x-3"
                >
                  <svg class="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                  <span class="text-sm font-medium text-red-600 dark:text-red-400">Delete Account</span>
=======
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Export Site Data</span>
                </button>
                
                <button
                  @click="clearCache"
                  class="w-full text-left px-4 py-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors flex items-center space-x-3"
                >
                  <svg class="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                  </svg>
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Clear Cache</span>
>>>>>>> f0e09af1bceb11f4155c223dfbecef0e5c46821a
                </button>
              </div>
            </div>
          </div>
<<<<<<< HEAD
=======
>>>>>>> e1e5a2d753b6ecde04aa69dea9993ab03e436096
=======
>>>>>>> f0e09af1bceb11f4155c223dfbecef0e5c46821a
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { usePluginStore } from '@/stores/plugins'
import { useToastStore } from '@/stores/toast'
import { useSettingsStore } from '@/stores/settings'

const authStore = useAuthStore()
const pluginStore = usePluginStore()
const toastStore = useToastStore()
const settingsStore = useSettingsStore()

const savingPayment = ref(false)
const savingSite = ref(false)
const savingSecurity = ref(false)

// Security Settings Form - using reactive from settings store
const securityForm = ref({
  allowRegistration: settingsStore.allowRegistration,
  requireEmailVerification: settingsStore.requireEmailVerification,
  requirePluginApproval: settingsStore.requirePluginApproval
})

// Payment Settings Form
const paymentForm = ref({
  paypalEmail: '',
  stripeConnected: false
})

<<<<<<< HEAD
const user = computed(() => authStore.user)

const updateProfile = async () => {
  saving.value = true
  try {
    // TODO: Implement profile update API call
    console.log('Updating profile:', profileForm.value)
    await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
    toastStore.success('Profile updated successfully!')
  } catch (error) {
    toastStore.error('Failed to update profile')
  } finally {
    saving.value = false
  }
}
=======
// Site Settings Form
const siteForm = ref({
  siteName: 'Plugin Marketplace',
  commissionRate: 10,
  minPrice: 1.00
})

// Site Statistics
const siteStats = computed(() => {
  const totalPlugins = pluginStore.plugins.length
  const totalRevenue = pluginStore.plugins.reduce((sum, plugin) => {
    return sum + (plugin.price * plugin._count.purchases)
  }, 0)

  return {
    totalUsers: 150, // Mock data - should come from user store
    totalPlugins,
    totalRevenue: totalRevenue.toFixed(2)
  }
})
>>>>>>> f0e09af1bceb11f4155c223dfbecef0e5c46821a

const updatePaymentSettings = async () => {
  savingPayment.value = true
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    toastStore.success('Payment settings updated successfully')
  } catch (error) {
    toastStore.error('Failed to update payment settings')
  } finally {
    savingPayment.value = false
  }
}

const updateSiteSettings = async () => {
  savingSite.value = true
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    toastStore.success('Site settings updated successfully')
  } catch (error) {
    toastStore.error('Failed to update site settings')
  } finally {
    savingSite.value = false
  }
}

const updateSecuritySettings = async () => {
  savingSecurity.value = true
  try {
    // Update settings store
    await settingsStore.updateSettings(securityForm.value)
    
    toastStore.success('Security settings updated successfully')
  } catch (error) {
    toastStore.error('Failed to update security settings')
  } finally {
    savingSecurity.value = false
  }
}

const exportData = () => {
  // Implement data export functionality
  toastStore.info('Export feature coming soon')
}

const clearCache = () => {
  // Implement cache clearing functionality
  toastStore.success('Cache cleared successfully')
}

const formatDate = (date: string | undefined) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString()
}

onMounted(() => {
  // Load settings from store
  settingsStore.loadSettings()
  
  // Update security form values with loaded settings
  securityForm.value = {
    allowRegistration: settingsStore.allowRegistration,
    requireEmailVerification: settingsStore.requireEmailVerification,
    requirePluginApproval: settingsStore.requirePluginApproval
  }
})
</script>