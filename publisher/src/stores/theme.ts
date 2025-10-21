import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  const theme = ref<'light' | 'dark'>('light')

  // Load theme from localStorage on initialization
  const loadTheme = () => {
    try {
      const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null
      if (savedTheme) {
        theme.value = savedTheme
      } else {
        // Check system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        theme.value = prefersDark ? 'dark' : 'light'
      }
      applyTheme()
    } catch (error) {
      console.error('Error loading theme:', error)
      // Fallback to system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      theme.value = prefersDark ? 'dark' : 'light'
      applyTheme()
    }
  }

  const applyTheme = () => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement
      if (theme.value === 'dark') {
        root.classList.add('dark')
      } else {
        root.classList.remove('dark')
      }
    }
  }

  const toggleTheme = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
    try {
      localStorage.setItem('theme', theme.value)
    } catch (error) {
      console.error('Error saving theme:', error)
    }
    applyTheme()
  }

  const setTheme = (newTheme: 'light' | 'dark') => {
    theme.value = newTheme
    try {
      localStorage.setItem('theme', newTheme)
    } catch (error) {
      console.error('Error saving theme:', error)
    }
    applyTheme()
  }

  // Watch for theme changes
  watch(theme, (newTheme) => {
    try {
      localStorage.setItem('theme', newTheme)
    } catch (error) {
      console.error('Error saving theme:', error)
    }
    applyTheme()
  })

  return {
    theme,
    loadTheme,
    toggleTheme,
    setTheme
  }
})