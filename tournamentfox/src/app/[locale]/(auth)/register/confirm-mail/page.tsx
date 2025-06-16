'use client'

import React, { useState } from 'react'
import styles from './page.module.scss'
import { LockIcon } from '@/assets/icons'
import TextInput from '@/components/inputs/TextInput/TextInput'
import {Link, useRouter} from '@/i18n/navigation'
import Button from '@/components/Button/Button'
import AuthTopBar from '@/components/Topbar/AuthTopBar/AuthTopBar'
import ScrollContainer from '@/components/utils/ScrollContainer/ScrollContainer'
import { useTranslations } from 'next-intl'
import CodeInput from '@/components/inputs/CodeInput/CodeInput'


export default function ConfirmMailPage() {
  const [email, setEmail] = useState('')
  const router = useRouter()
  const [code, setCode] = useState('')
  const t = useTranslations('confirmMail')
  return (
    <>
    <AuthTopBar hasBackButton backButtonOnClick={() => router.push('/register')} />
    <ScrollContainer>
    <h4 className={styles.title}>{t('title')}</h4>
    <p className={styles.subtitle}>{t('subtitle')}</p>
    <p className={styles.description}>{t('description', { email })}</p>
    <div className={styles.formContainer}>
    <form className={styles.form}>
      <CodeInput length={6} value={code} onChange={setCode} />
      <Button title={t('continue')} variant='filled' fullWidth className={styles.continueButton} />
    </form>
    <Button title={t('resendEmail')} variant='text' fullWidth className={styles.resendEmailButton}/>
    </div>
    </ScrollContainer>
    </>
  )
}
