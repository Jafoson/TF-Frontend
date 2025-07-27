'use client'

import React, { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { oauthTokenLogin } from '@/actions/auth'
import { useNotification } from '@/context/NotificationContext'
import { ALoadingIcon } from '@/assets/icons'
import AuthTopBar from '@/components/Topbar/AuthTopBar/AuthTopBar'
import ScrollContainer from '@/components/utils/ScrollContainer/ScrollContainer'
import styles from './page.module.scss'

export default function OAuthCallbackPage() {
  const t = useTranslations('login')
  const { showSuccess, showError } = useNotification()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isProcessing, setIsProcessing] = useState(true)

  useEffect(() => {
    const processOAuthCallback = async () => {
      try {
        // OAuth-Parameter aus der URL extrahieren
        const code = searchParams.get('code')
        const state = searchParams.get('state')
        const error = searchParams.get('error')
        const provider = searchParams.get('provider') || 'google'

        // Fehler beim OAuth-Flow
        if (error) {
          showError(t('error'), `OAuth-Fehler: ${error}`)
          router.push('/login')
          return
        }

        // Kein Authorization Code erhalten
        if (!code) {
          showError(t('error'), 'Kein Authorization Code erhalten')
          router.push('/login')
          return
        }

        // OAuth Token Login durchführen
        const result = await oauthTokenLogin(provider, code, state || undefined)

        if (result.success) {
          showSuccess(t('success'), t('loginSuccessful'))
          router.push('/') // Zur Hauptseite weiterleiten
        } else {
          showError(t(result.code || 'LOGIN_ERROR'), t(result.code + '_DESCRIPTION' || 'LOGIN_ERROR_DESCRIPTION'))
          router.push('/login')
        }
      } catch (error) {
        console.error('OAuth Callback Fehler:', error)
        showError(t('error'), t('unexpectedError'))
        router.push('/login')
      } finally {
        setIsProcessing(false)
      }
    }

    processOAuthCallback()
  }, [searchParams, t, showSuccess, showError, router])

  return (
    <>
      <AuthTopBar />
      <ScrollContainer>
        <div className={styles.container}>
          <div className={styles.loadingIcon}>
            <ALoadingIcon />
          </div>
          <h4 className={styles.title}>
            {isProcessing ? 'Anmeldung wird verarbeitet...' : 'Weiterleitung...'}
          </h4>
          <p className={styles.subtitle}>Sie werden automatisch weitergeleitet.</p>
        </div>
      </ScrollContainer>
    </>
  )
} 