"use client"

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from 'react'

export type NotificationType = 'success' | 'error' | 'warning' | 'info'

export interface Notification {
  id: string
  type: NotificationType
  title: string
  message?: string
  duration?: number
  persistent?: boolean
}

interface NotificationContextProps {
  notifications: Notification[]
  addNotification: (notification: Omit<Notification, 'id'>) => string
  removeNotification: (id: string) => void
  clearNotifications: () => void
  showSuccess: (title: string, message?: string, duration?: number) => string
  showError: (title: string, message?: string, duration?: number) => string
  showWarning: (title: string, message?: string, duration?: number) => string
  showInfo: (title: string, message?: string, duration?: number) => string
}

const NotificationContext = createContext<NotificationContextProps>({
  notifications: [],
  addNotification: () => '',
  removeNotification: () => {},
  clearNotifications: () => {},
  showSuccess: () => '',
  showError: () => '',
  showWarning: () => '',
  showInfo: () => '',
})

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const generateId = useCallback(() => {
    return Math.random().toString(36).substr(2, 9)
  }, [])

  const addNotification = useCallback((notification: Omit<Notification, 'id'>) => {
    const id = generateId()
    const newNotification: Notification = {
      id,
      duration: 5000, // Standard-Dauer: 5 Sekunden
      ...notification,
    }

    setNotifications(prev => [...prev, newNotification])

    // Automatisches Entfernen nach der angegebenen Dauer (außer bei persistenten Notifications)
    if (!newNotification.persistent && newNotification.duration) {
      setTimeout(() => {
        removeNotification(id)
      }, newNotification.duration)
    }

    return id
  }, [generateId])

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id))
  }, [])

  const clearNotifications = useCallback(() => {
    setNotifications([])
  }, [])

  const showSuccess = useCallback((title: string, message?: string, duration?: number) => {
    return addNotification({
      type: 'success',
      title,
      message,
      duration,
    })
  }, [addNotification])

  const showError = useCallback((title: string, message?: string, duration?: number) => {
    return addNotification({
      type: 'error',
      title,
      message,
      duration,
    })
  }, [addNotification])

  const showWarning = useCallback((title: string, message?: string, duration?: number) => {
    return addNotification({
      type: 'warning',
      title,
      message,
      duration,
    })
  }, [addNotification])

  const showInfo = useCallback((title: string, message?: string, duration?: number) => {
    return addNotification({
      type: 'info',
      title,
      message,
      duration,
    })
  }, [addNotification])

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        removeNotification,
        clearNotifications,
        showSuccess,
        showError,
        showWarning,
        showInfo,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotification = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider')
  }
  return context
} 