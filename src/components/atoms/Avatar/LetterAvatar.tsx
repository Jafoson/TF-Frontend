import React from 'react'
import styles from './LetterAvatar.module.scss'

function LetterAvatar({ letter, className}: { letter: string, className?: string }) {

    const getLetter = () => {
        return letter.charAt(0).toUpperCase()
    }
  return (
    <div className={`${styles.letterAvatar} ${className || ""}`} tabIndex={0}>
        <span>{getLetter()}</span>
    </div>
  )
}

export default LetterAvatar