'use client'

import React, { useState } from 'react'
import styles from './page.module.scss'
import IconButton from '@/components/IconButton/IconButton'
import CloseIcon from '@/assets/icons/CloseIcon'	
import TextInput from '@/components/inputs/TextInput/TextInput'

function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  return (
    <>
    <div className={styles.header}>
          <IconButton icon={CloseIcon} variant='text' />
    </div>
    <h4 className={styles.title}>Willkommen zurück, Beschwörer!</h4>
    <form className={styles.form}>
      <TextInput type="text" label='E-Mail / Username' placeholder='max@example.com... | Example123...' value={email} onChange={(value) => setEmail(typeof value === 'string' ? value : value.target.value)} icon={CloseIcon}/>
      <TextInput type="password" label='Passwort' placeholder='Password123...' value={password} onChange={(value) => setPassword(typeof value === 'string' ? value : value.target.value)} icon={CloseIcon}/>
    </form>
    </>
  )
}

export default LoginPage