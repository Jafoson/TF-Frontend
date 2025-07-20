'use client'

import React, { useEffect } from 'react'
import styles from './page.module.scss'
import Button from '@/components/Button/Button'
import AuthTopBar from '@/components/Topbar/AuthTopBar/AuthTopBar'
import ScrollContainer from '@/components/utils/ScrollContainer/ScrollContainer'
import { useTranslations } from 'next-intl'
import ALoadingIcon from '@/assets/icons/ALoadingIcon'
import { useParams } from 'next/navigation'
import { useRouter } from '@/i18n/navigation'
import { verifyCode } from '@/actions/auth'

export default function ConfirmMailStatePage() {
  const t = useTranslations('confirmMailState')
  const params = useParams()
  const router = useRouter()

  useEffect(() => {
    const handleAutoVerify = async () => {
      const code = params.code as string
      
      if (!code) {
        router.push('/verify/failure')
        return
      }

      try {
        const formData = new FormData()
        formData.append('code', code)

        const result = await verifyCode(formData)

        if (result.success) {
          router.push('/verify/success')
        } else {
          router.push('/verify/failure')
        }
      } catch (error) {
        console.error('Auto-Verifizierungsfehler:', error)
        router.push('/verify/failure')
      }
    }

    handleAutoVerify()
  }, [params.code, router])

  return (
    <>
    <AuthTopBar />
    <ScrollContainer>
    <h4 className={styles.title}>{t('title')}</h4>
    <ALoadingIcon className={styles.successIcon} height={128} width={128}/>
    <p className={styles.subtitle}>{t('subtitle')}</p>
    <p className={styles.description}>{t('description')}</p>
    </ScrollContainer>
    </>
  )
}
