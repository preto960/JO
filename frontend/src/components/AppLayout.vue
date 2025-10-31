<template>
  <div class="flex h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
    <!-- Sidebar -->
    <Sidebar :is-collapsed="isSidebarCollapsed" />
    
    <!-- Main Content -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Header -->
      <Header 
        :is-sidebar-collapsed="isSidebarCollapsed" 
        @toggle-sidebar="toggleSidebar"
      />
      
      <!-- Main Content Area -->
      <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-gray-900 p-6 transition-colors">
        <router-view />
      </main>
    </div>

    <!-- WebSocket Status Indicator -->
    <WebSocketStatus />
    
    <!-- Plugin Operation Modal -->
    <PluginInstallModal
      :is-open="pluginsStore.operationModal.isOpen"
      :status="pluginsStore.operationModal.status"
      :operation="pluginsStore.operationModal.operation"
      :plugin-name="pluginsStore.operationModal.pluginName"
      :steps="pluginsStore.operationModal.steps"
      @close="pluginsStore.closeOperationModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Sidebar from '@/components/Sidebar.vue'
import Header from '@/components/Header.vue'
import WebSocketStatus from '@/components/WebSocketStatus.vue'
import PluginInstallModal from '@/components/PluginInstallModal.vue'
import { useAuthStore } from '@/stores/auth'
import { usePluginsStore } from '@/stores/plugins'

const authStore = useAuthStore()
const pluginsStore = usePluginsStore()

const isSidebarCollapsed = ref(false)

const toggleSidebar = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value
}

onMounted(() => {
  authStore.initializeAuth()
})
</script>
