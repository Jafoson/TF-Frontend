'use client'

import React from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import dayjs from 'dayjs'
import styles from './NowChip.module.scss'

function NowChip() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  // Aktuelles Datum aus URL lesen
  const urlDate = searchParams.get('date')
  const today = dayjs().format('YYYY-MM-DD')
  const isToday = urlDate === today

  // Navigation zum heutigen Tag
  const goToToday = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('date', today)
    router.push(`${pathname}?${params.toString()}`)
  }

  // Chip nur anzeigen wenn nicht bereits heutiges Datum
  if (isToday) {
    return null
  }

  return (
    <div className={styles.absolutPosition}>
        <button className={styles.nowChip} onClick={goToToday}>
        <span>Zum heutigen Tag wechseln</span>
    </button>
    </div>
  )
}

export default NowChip