import React from 'react'
import styles from './ScrollContainer.module.scss'

type ScrollContainerProps = {
    children: React.ReactNode
}

function ScrollContainer({children}: ScrollContainerProps) {
  return (
    <div className={styles.container}>{children}</div>
  )
}

export default ScrollContainer