'use client'

import React, { useState } from 'react'
import styles from './page.module.scss'
import { MailIcon } from '@/assets/icons'
import TextInput from '@/components/inputs/TextInput/TextInput'
import {useRouter} from '@/i18n/navigation'
import Button from '@/components/Button/Button'
import AuthTopBar from '@/components/Topbar/AuthTopBar/AuthTopBar'
import ScrollContainer from '@/components/utils/ScrollContainer/ScrollContainer'
import { useTranslations } from 'next-intl'
import { useNotification } from '@/context/NotificationContext'
import { requestPasswordReset } from '@/actions/auth'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const t = useTranslations('forgotPassword')
  const { showError, showSuccess } = useNotification()

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    if (!email.trim()) {
      showError(t('EMAIL_REQUIRED'), t('EMAIL_REQUIRED_DESCRIPTION'))
      setIsLoading(false)
      return
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      showError(t('INVALID_EMAIL'), t('INVALID_EMAIL_DESCRIPTION'))
      setIsLoading(false)
      return
    }

    try {
      const formData = new FormData()
      formData.append('email', email)

      const result = await requestPasswordReset(formData)

      if (!result.success) {
        showError(t(result.code || 'REQUEST_RESET_ERROR'), t(result.code + '_DESCRIPTION' || 'REQUEST_RESET_ERROR_DESCRIPTION'))
        return
      }

      showSuccess(t('REQUEST_RESET_SUCCESS'), t('REQUEST_RESET_SUCCESS_DESCRIPTION'))
      router.push('/forgot-password/send')
    } catch (err) {
      console.error(err)
      showError('INTERNAL_SERVER_ERROR', t('INTERNAL_SERVER_ERROR_DESCRIPTION'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
    <AuthTopBar hasBackButton backButtonOnClick={() => router.push('/login')} />
    <ScrollContainer>
    <h4 className={styles.title}>{t('title')}</h4>
    <p className={styles.subtitle}>{t('subtitle')}</p>
    <p className={styles.description}>{t('description')}</p>
    <div className={styles.formContainer}>
    <form className={styles.form} onSubmit={handleRequestReset}>
      <TextInput 
        type="email" 
        label={t('mail')} 
        placeholder={t('mailPlaceholder')} 
        value={email} 
        onChange={(value) => setEmail(typeof value === 'string' ? value : value.target.value)} 
        icon={MailIcon}
        autoComplete="email"
      />
      <Button 
        title={t('resetPassword')} 
        variant='filled' 
        fullWidth 
        className={styles.resetPasswordButton} 
        disabled={!email.trim()}
        loading={isLoading}
      />
    </form>
    <p className={styles.footerText}>{t('footerText')}</p>
    </div>
    </ScrollContainer>
    </>
  )
}
