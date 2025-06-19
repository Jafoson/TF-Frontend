'use client'

import React from 'react'
import { useNotification } from '@/context/NotificationContext'
import Button from '@/components/Button/Button'

export default function NotificationExample() {
  const { showSuccess, showError, showWarning, showInfo } = useNotification()

  const handleShowSuccess = () => {
    showSuccess('Erfolg!', 'Die Aktion wurde erfolgreich ausgeführt.')
  }

  const handleShowError = () => {
    showError('Fehler!', 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.')
  }

  const handleShowWarning = () => {
    showWarning('Warnung!', 'Bitte überprüfen Sie Ihre Eingaben.')
  }

  const handleShowInfo = () => {
    showInfo('Information', 'Hier ist eine wichtige Information für Sie.')
  }

  const handleShowPersistent = () => {
    showInfo('Persistente Nachricht', 'Diese Nachricht bleibt bestehen, bis Sie sie schließen.', 0)
  }

  return (
    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <h3>Notification Beispiele</h3>
      <Button title="Erfolg anzeigen" variant="filled" onClick={handleShowSuccess} />
      <Button title="Fehler anzeigen" variant="filled" onClick={handleShowError} />
      <Button title="Warnung anzeigen" variant="filled" onClick={handleShowWarning} />
      <Button title="Info anzeigen" variant="filled" onClick={handleShowInfo} />
      <Button title="Persistente Nachricht" variant="outlined" onClick={handleShowPersistent} />
    </div>
  )
} 