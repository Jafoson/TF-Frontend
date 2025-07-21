'use client'

import React, { useState } from 'react'
import styles from './page.module.scss'
import { LockIcon } from '@/assets/icons'
import TextInput from '@/components/inputs/TextInput/TextInput'
import {useRouter} from '@/i18n/navigation'
import Button from '@/components/Button/Button'
import AuthTopBar from '@/components/Topbar/AuthTopBar/AuthTopBar'
import ScrollContainer from '@/components/utils/ScrollContainer/ScrollContainer'
import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import { useNotification } from '@/context/NotificationContext'
import { resetPassword } from '@/actions/auth'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const params = useParams()
  const t = useTranslations('resetPassword')
  const { showError, showSuccess } = useNotification()

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Validierung
    if (!password.trim() || !confirmPassword.trim()) {
      showError(t('PASSWORD_REQUIRED'), t('PASSWORD_REQUIRED_DESCRIPTION'))
      setIsLoading(false)
      return
    }

    if (password !== confirmPassword) {
      showError(t('PASSWORDS_NOT_MATCH'), t('PASSWORDS_NOT_MATCH_DESCRIPTION'))
      setIsLoading(false)
      return
    }

    if (password.length < 8) {
      showError(t('PASSWORD_TOO_SHORT'), t('PASSWORD_TOO_SHORT_DESCRIPTION'))
      setIsLoading(false)
      return
    }

    const token = params.code as string
    if (!token) {
      showError(t('INVALID_RESET_TOKEN'), t('INVALID_RESET_TOKEN_DESCRIPTION'))
      setIsLoading(false)
      return
    }

    try {
      const formData = new FormData()
      formData.append('token', token)
      formData.append('newPassword', password)

      const result = await resetPassword(formData)

      if (!result.success) {
        showError(t(result.code || 'RESET_PASSWORD_ERROR'), t(result.code + '_DESCRIPTION' || 'RESET_PASSWORD_ERROR_DESCRIPTION'))
        return
      }

      showSuccess(t('RESET_PASSWORD_SUCCESS'), t('RESET_PASSWORD_SUCCESS_DESCRIPTION'))
      router.push('/forgot-password/reset/success')
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
    <form className={styles.form} onSubmit={handleResetPassword}>
      <TextInput 
        type="password" 
        label={t('password')} 
        placeholder={t('passwordPlaceholder')} 
        value={password} 
        onChange={(value) => setPassword(typeof value === 'string' ? value : value.target.value)} 
        icon={LockIcon}
        autoComplete="new-password"
      />
      <TextInput 
        type="password" 
        label={t('confirmPassword')} 
        placeholder={t('confirmPasswordPlaceholder')} 
        value={confirmPassword} 
        onChange={(value) => setConfirmPassword(typeof value === 'string' ? value : value.target.value)} 
        icon={LockIcon}
        autoComplete="new-password"
      />
      <Button 
        title={t('resetPassword')} 
        variant='filled' 
        fullWidth 
        className={styles.resetPasswordButton} 
        disabled={!password.trim() || !confirmPassword.trim()}
        loading={isLoading}
      />
    </form>
    </div>
    </ScrollContainer>
    </>
  )
}
