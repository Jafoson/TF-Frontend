'use client'

import React, { useState } from 'react'
import styles from './page.module.scss'
import TextInput from '@/components/inputs/TextInput/TextInput'
import {Link} from '@/i18n/navigation'
import Button from '@/components/Button/Button'
import { AppleLogoIcon, GoogleLogoIcon, LockIcon, MailIcon, UserIcon } from '@/assets/icons'
import AuthTopBar from '@/components/Topbar/AuthTopBar/AuthTopBar'
import ScrollContainer from '@/components/utils/ScrollContainer/ScrollContainer'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { registerSchema } from '@/schemas/auth'
import { useNotification } from '@/context/NotificationContext'

interface ValidationError {
  field: string;
  message: string;
}

export default function RegisterPage() {
  const t = useTranslations('register')
  const router = useRouter()
  const { showSuccess, showError } = useNotification()
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState<ValidationError[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors([])
    setIsLoading(true)

    const validationResult = registerSchema.safeParse({
      email,
      username,
      password,
      confirmPassword,
    })

     
    if (!validationResult.success) {
      setErrors(validationResult.error?.errors.map(err => ({ field: err.path.join('.'), message: t(err.message) })) || [])
      setIsLoading(false)
      showError('Validierungsfehler', 'Bitte überprüfen Sie Ihre Eingaben.')
      return
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          username,
          password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.details) {
          setErrors(data.details)
        } else {
          setErrors([{ field: 'general', message: data.error || t('registrationFailed') }])
        }
        showError('Registrierung fehlgeschlagen', data.error || t('registrationFailed'))
        return
      }

      localStorage.setItem('userID', data.user.userId)
      localStorage.setItem('username', data.user.username)
      localStorage.setItem('email', data.user.email)

      showSuccess('Registrierung erfolgreich', 'Ihr Konto wurde erfolgreich erstellt!')
      router.push('/register/confirm-mail')
    } catch (err) {
      console.error(err)
      setErrors([{ field: 'general', message: t('registrationFailed') }])
      showError('Registrierung fehlgeschlagen', 'Ein unerwarteter Fehler ist aufgetreten.')
    } finally {
      setIsLoading(false)
    }
  }

  const getFieldError = (fieldName: string) => {
    return errors
      .filter(error => error.field === fieldName)
      .map(error => error.message);
  }

  return (
    <>
    <AuthTopBar />
    <ScrollContainer>
    <h4 className={styles.title}>{t('title')}</h4>
    <div className={styles.formContainer}>
    <form className={styles.form} onSubmit={handleRegister}>
      <TextInput 
        type="email" 
        label={t('mail')} 
        placeholder={t('mailPlaceholder')} 
        value={email} 
        onChange={(value) => {
          setEmail(typeof value === 'string' ? value : value.target.value);
          setErrors(errors.filter(error => error.field !== 'email'));
        }} 
        icon={MailIcon}
        error={getFieldError('email').length > 0}
        errorMessage={getFieldError('email')}
      />
      <TextInput 
        type="text" 
        label={t('username')} 
        placeholder={t('usernamePlaceholder')} 
        value={username} 
        onChange={(value) => {
          setUsername(typeof value === 'string' ? value : value.target.value);
          setErrors(errors.filter(error => error.field !== 'username'));
        }} 
        icon={UserIcon}
        error={getFieldError('username').length > 0}
        errorMessage={getFieldError('username')}
      />
      <TextInput 
        type="password" 
        label={t('password')} 
        placeholder={t('passwordPlaceholder')} 
        value={password} 
        onChange={(value) => {
          setPassword(typeof value === 'string' ? value : value.target.value);
          setErrors(errors.filter(error => error.field !== 'password'));
        }} 
        icon={LockIcon}
        error={getFieldError('password').length > 0}
        errorMessage={getFieldError('password')}
      />
      <TextInput 
        type="password" 
        label={t('confirmPassword')} 
        placeholder={t('confirmPasswordPlaceholder')} 
        value={confirmPassword} 
        onChange={(value) => {
          setConfirmPassword(typeof value === 'string' ? value : value.target.value);
          setErrors(errors.filter(error => error.field !== 'confirmPassword'));
        }} 
        icon={LockIcon}
        error={getFieldError('confirmPassword').length > 0}
        errorMessage={getFieldError('confirmPassword')}
      />
      <Button 
        title={t('register')} 
        variant='filled' 
        fullWidth 
        className={styles.registerButton} 
        disabled={!email || !username || !password || !confirmPassword}
        loading={isLoading}
      />
    </form>
    </div>
    <div className={styles.orContainer}>
      <hr />
      <h6>{t('or')}</h6>
      <hr />
    </div>
    <div className={styles.socialContainer}>
      <Button title={t('registerWithGoogle')} variant='outlined' icon={GoogleLogoIcon} fullWidth />
      <Button title={t('registerWithApple')} variant='outlined' icon={AppleLogoIcon} fullWidth />
    </div>
    <div className={styles.footer}>
      <span>{t('alreadyHaveAccount')} <Link href='/login'>{t('login')}</Link></span>
    </div>
    </ScrollContainer>
    </>
  )
}
