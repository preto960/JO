import { ref, watch } from 'vue'
import { useSettingsStore } from '@/stores/settings'

export function useDocumentTitle() {
  const settingsStore = useSettingsStore()
  
  // Update document title when site name changes
  const updateDocumentTitle = (siteName: string) => {
    const title = siteName || 'Plugin Publisher'
    document.title = `${title} - Publisher Dashboard`
  }
  
  // Watch for changes in site name
  watch(() => settingsStore.siteName, (newSiteName) => {
    updateDocumentTitle(newSiteName)
  }, { immediate: true })
  
  // Initialize with current site name
  updateDocumentTitle(settingsStore.siteName)
  
  return {
    updateDocumentTitle
  }
}