'use client'

import React from 'react'
import styles from './Toast.module.scss'
import { Notification, NotificationType } from '@/context/NotificationContext'
import { CloseIcon } from '@/assets/icons'

interface ToastProps {
  notification: Notification
  onClose: (id: string) => void
}

const getIconForType = (type: NotificationType) => {
  switch (type) {
    case 'success':
      return '✓'
    case 'error':
      return '✕'
    case 'warning':
      return '⚠'
    case 'info':
      return 'ℹ'
    default:
      return '•'
  }
}

const getTypeClass = (type: NotificationType) => {
  switch (type) {
    case 'success':
      return styles.success
    case 'error':
      return styles.error
    case 'warning':
      return styles.warning
    case 'info':
      return styles.info
    default:
      return styles.info
  }
}

export default function Toast({ notification, onClose }: ToastProps) {
  const handleClose = () => {
    onClose(notification.id)
  }

  return (
    <div className={`${styles.toast} ${getTypeClass(notification.type)}`}>
      <div className={styles.icon}>
        {getIconForType(notification.type)}
      </div>
      <div className={styles.content}>
        <h6 className={styles.title}>{notification.title}</h6>
        {notification.message && (
          <p className={styles.message}>{notification.message}</p>
        )}
      </div>
      <button 
        className={styles.closeButton} 
        onClick={handleClose}
        aria-label="Schließen"
      >
        <CloseIcon />
      </button>
    </div>
  )
} 