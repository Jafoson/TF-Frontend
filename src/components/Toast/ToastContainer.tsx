'use client'

import React from 'react'
import styles from './ToastContainer.module.scss'
import { useNotification } from '@/context/NotificationContext'
import Toast from './Toast'

export default function ToastContainer() {
  const { notifications, removeNotification } = useNotification()

  if (notifications.length === 0) {
    return null
  }

  return (
    <div className={styles.container}>
      {notifications.map((notification) => (
        <Toast
          key={notification.id}
          notification={notification}
          onClose={removeNotification}
        />
      ))}
    </div>
  )
} 