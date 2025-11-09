'use client'

import React from 'react'
import styles from './IconButton.module.scss'

type IconButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    icon: React.FC<React.SVGProps<SVGSVGElement>>
    disabled?: boolean
    variant?: 'filled' | 'outlined' | 'text' | 'tonal'
    iconColor?: string | 'inherit'
    iconSize?: number
    className?: string
    rotate?: number
    padding?: string
}

function IconButton({icon: Icon, disabled = false, variant = 'text', iconColor, iconSize = 24, className, rotate, padding, ...props}: IconButtonProps) {
    return (
    <button className={`${styles.iconButton} ${styles[variant]} ${className || ''}`} disabled={disabled} style={{ padding: padding ? `${padding}rem` : '0.25rem' }} {...props}>
        <Icon height={iconSize} width={iconSize} color={iconColor || 'inherit'}   style={{ transform: `rotate(${rotate}deg)` }}/>
    </button>
  )
}

export default IconButton