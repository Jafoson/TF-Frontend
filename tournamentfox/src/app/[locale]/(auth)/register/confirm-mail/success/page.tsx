'use client'

import React from 'react'
import styles from './page.module.scss'
import {useRouter} from '@/i18n/navigation'
import Button from '@/components/Button/Button'
import AuthTopBar from '@/components/Topbar/AuthTopBar/AuthTopBar'
import ScrollContainer from '@/components/utils/ScrollContainer/ScrollContainer'
import { useTranslations } from 'next-intl'
import { SuccessIcon } from '@/assets/icons'


export default function ConfirmMailSuccessPage() {
  const router = useRouter()
  const t = useTranslations('confirmMailSuccess')
  return (
    <>
    <AuthTopBar />
    <ScrollContainer>
    <h4 className={styles.title}>{t('title')}</h4>
    <SuccessIcon className={styles.successIcon} height={128} width={128}/>
    <p className={styles.subtitle}>{t('subtitle')}</p>
    <p className={styles.description}>{t('description')}</p>
    <div className={styles.formContainer}>
    <Button title={t('continue')} variant='filled' fullWidth className={styles.continueButton}/>
    </div>
    </ScrollContainer>
    </>
  )
}
