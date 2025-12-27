'use client'

import Button from '@/components/atoms/Button/Button'
import React from 'react'
import styles from './LoginRegisterWrapper.module.scss'
import { useTranslations } from 'next-intl';

function LoginRegisterWrapper() {
    const t = useTranslations("topBar");

  return (
    <>
    <Button
    className={styles.topBarLoginButton}
    isLink
    variant="outlined"
    size="small"
    title={t("login")}
    href="/login"
  />
  <Button
    isLink
    variant="filled"
    size="small"
    title={t("register")}
    className={styles.topBarRegisterButton}
    href="/register"
  />
  </>
  )
}

export default LoginRegisterWrapper
