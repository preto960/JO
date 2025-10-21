import { ref, reactive } from 'vue'
import { defineStore } from 'pinia'

export interface Toast {
  id: string
  type: 'success' | 'error' | 'info'
  title?: string
  message?: string
  duration?: number
}

export const useToastStore = defineStore('toast', () => {
  const toasts = ref<Toast[]>([])

  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = Date.now().toString()
    const newToast: Toast = {
      id,
      ...toast
    }
    toasts.value.push(newToast)
    
    // Auto remove after duration
    if (toast.duration !== 0) {
      setTimeout(() => {
        removeToast(id)
      }, toast.duration || 5000)
    }
    
    return id
  }

  const removeToast = (id: string) => {
    const index = toasts.value.findIndex(toast => toast.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }

  const success = (message: string, title?: string, duration?: number) => {
    return addToast({
      type: 'success',
      title: title || 'Success',
      message,
      duration
    })
  }

  const error = (message: string, title?: string, duration?: number) => {
    return addToast({
      type: 'error',
      title: title || 'Error',
      message,
      duration: duration || 7000 // Errors stay longer
    })
  }

  const info = (message: string, title?: string, duration?: number) => {
    return addToast({
      type: 'info',
      title: title || 'Info',
      message,
      duration
    })
  }

  const clear = () => {
    toasts.value = []
  }

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    info,
    clear
  }
})