'use client'

import React from 'react'
import styles from './page.module.scss'
import Button from '@/components/Button/Button'
import AuthTopBar from '@/components/Topbar/AuthTopBar/AuthTopBar'
import ScrollContainer from '@/components/utils/ScrollContainer/ScrollContainer'
import { useTranslations } from 'next-intl'
import { FailureIcon } from '@/assets/icons'


export default function ConfirmMailFailurePage() {
  const t = useTranslations('confirmMailFailure')
  return (
    <>
    <AuthTopBar />
    <ScrollContainer>
    <h4 className={styles.title}>{t('title')}</h4>
    <FailureIcon className={styles.successIcon} height={128} width={128}/>
    <p className={styles.subtitle}>{t('subtitle')}</p>
    <p className={styles.description}>{t('description')}</p>
    <div className={styles.formContainer}>
    <Button title={t('resendEmail')} variant='filled' fullWidth className={styles.continueButton}/>
    </div>
    </ScrollContainer>
    </>
  )
}
