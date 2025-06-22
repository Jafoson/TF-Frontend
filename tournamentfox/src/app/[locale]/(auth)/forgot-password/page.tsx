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


export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const router = useRouter()
  const t = useTranslations('forgotPassword')

  return (
    <>
    <AuthTopBar hasBackButton backButtonOnClick={() => router.push('/login')} />
    <ScrollContainer>
    <h4 className={styles.title}>{t('title')}</h4>
    <p className={styles.subtitle}>{t('subtitle')}</p>
    <p className={styles.description}>{t('description')}</p>
    <div className={styles.formContainer}>
    <form className={styles.form}>
      <TextInput type="text" label={t('mail')} placeholder={t('mailPlaceholder')} value={email} onChange={(value) => setEmail(typeof value === 'string' ? value : value.target.value)} icon={LockIcon}/>
      <Button title={t('resetPassword')} variant='filled' fullWidth className={styles.resetPasswordButton} disabled={!email}/>
    </form>
    <Button title={t('resendEmail')} variant='text' fullWidth className={styles.resendEmailButton} disabled={!email}/>
    <p className={styles.footerText}>{t('footerText')}</p>
    </div>
    </ScrollContainer>
    </>
  )
}
