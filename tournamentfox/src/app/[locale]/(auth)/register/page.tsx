'use client'

import React, { useState, Suspense } from 'react'
import styles from './page.module.scss'
import IconButton from '@/components/IconButton/IconButton'
import CloseIcon from '@/assets/icons/CloseIcon'	
import TextInput from '@/components/inputs/TextInput/TextInput'
import Checkbox from '@/components/inputs/Checkbox/Checkbox'
import {Link} from '@/i18n/navigation'
import Button from '@/components/Button/Button'
import { AppleLogoIcon, GoogleLogoIcon, LockIcon, MailIcon, UserIcon } from '@/assets/icons'
import AuthTopBar from '@/components/Topbar/AuthTopBar/AuthTopBar'
import ScrollContainer from '@/components/utils/ScrollContainer/ScrollContainer'
import { useTranslations } from 'next-intl'


export default function RegisterPage() {
  const t = useTranslations('register')
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')


  return (
    <>
    <AuthTopBar  />
    <ScrollContainer>
    <h4 className={styles.title}>{t('title')}</h4>
    <div className={styles.formContainer}>
    <form className={styles.form}>
      <TextInput type="text" label={t('mail')} placeholder={t('mailPlaceholder')} value={email} onChange={(value) => setEmail(typeof value === 'string' ? value : value.target.value)} icon={MailIcon}/>
      <TextInput type="text" label={t('username')} placeholder={t('usernamePlaceholder')} value={username} onChange={(value) => setUsername(typeof value === 'string' ? value : value.target.value)} icon={UserIcon}/>
      <TextInput type="password" label={t('password')} placeholder={t('passwordPlaceholder')} value={password} onChange={(value) => setPassword(typeof value === 'string' ? value : value.target.value)} icon={LockIcon}/>
      <TextInput type="password" label={t('confirmPassword')} placeholder={t('confirmPasswordPlaceholder')} value={confirmPassword} onChange={(value) => setConfirmPassword(typeof value === 'string' ? value : value.target.value)} icon={LockIcon}/>
      <Button title={t('register')} variant='filled' fullWidth className={styles.registerButton} disabled={!email || !username || !password || !confirmPassword}/>
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
