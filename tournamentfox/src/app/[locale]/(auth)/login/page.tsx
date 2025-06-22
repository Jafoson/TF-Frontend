'use client'

import React, { useState } from 'react'
import styles from './page.module.scss'
import TextInput from '@/components/inputs/TextInput/TextInput'
import Checkbox from '@/components/inputs/Checkbox/Checkbox'
import {Link} from '@/i18n/navigation'
import Button from '@/components/Button/Button'
import { AppleLogoIcon, GoogleLogoIcon, LockIcon } from '@/assets/icons'
import AuthTopBar from '@/components/Topbar/AuthTopBar/AuthTopBar'
import ScrollContainer from '@/components/utils/ScrollContainer/ScrollContainer'
import { useTranslations } from 'next-intl'
import MailIcon from '@/assets/icons/MailIcon'


export default function LoginPage() {
  const t = useTranslations('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [data, setData] = useState({
    remember: {
      value: false,
      title: t('rememberMe')
    }
  });

  return (
    <>
    <AuthTopBar  />
    <ScrollContainer>
    <h4 className={styles.title}>{t('title')}</h4>
    <div className={styles.formContainer}>
    <form className={styles.form}>
      <TextInput type="text" label={t('mail')} placeholder={t('mailPlaceholder')} value={email} onChange={(value) => setEmail(typeof value === 'string' ? value : value.target.value)} icon={MailIcon}/>
      <TextInput type="password" label={t('password')} placeholder={t('passwordPlaceholder')} value={password} onChange={(value) => setPassword(typeof value === 'string' ? value : value.target.value)} icon={LockIcon}/>
      <div className={styles.checkboxContainer}>
        <Checkbox data={data} onChange={setData} />
        <Link className={styles.forgotPassword} href='/forgot-password'>{t('forgotPassword')}</Link>
      </div>
      <Button title={t('login')} variant='filled' fullWidth disabled={!email || !password}/>
    </form>
    </div>
    <div className={styles.orContainer}>
      <hr />
      <h6>{t('or')}</h6>
      <hr />
    </div>
    <div className={styles.socialContainer}>
      <Button title={t('loginWithGoogle')} variant='outlined' icon={GoogleLogoIcon} fullWidth />
      <Button title={t('loginWithApple')} variant='outlined' icon={AppleLogoIcon} fullWidth />
    </div>
    <div className={styles.footer}>
      <span>{t('dontHaveAccount')} <Link href='/register'>{t('register')}</Link></span>
    </div>
    </ScrollContainer>
    </>
  )
}
