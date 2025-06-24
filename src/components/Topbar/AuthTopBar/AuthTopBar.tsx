import React from 'react'
import styles from './AuthTopBar.module.scss'
import IconButton from '@/components/IconButton/IconButton'
import { ArrowBackIcon, CloseIcon } from '@/assets/icons'
import Image from 'next/image'
import { useTheme } from '@/context/ThemeContext'
import { useRouter } from '@/i18n/navigation'

type AuthTopBarProps = {
    hasBackButton?: boolean
    backButtonOnClick?: () => void
}

function AuthTopBar({hasBackButton = false, backButtonOnClick}: AuthTopBarProps) {
    const {effectiveTheme} = useTheme()
    const router = useRouter()
    return (
    <div className={styles.container} data-has-back-button={hasBackButton}>
        {hasBackButton ? <IconButton icon={ArrowBackIcon} variant='text' className={styles.backButton} onClick={backButtonOnClick ? backButtonOnClick : () => router.back()} /> : <div className={styles.placeholder}/>}
        <Image src={`/logo/tf_logo_${effectiveTheme}.svg`} alt="logo" width={256} height={78} className={styles.logo} />
          <IconButton icon={CloseIcon} variant='text' onClick={() => router.push('/')} />
    </div>
  )
}

export default AuthTopBar