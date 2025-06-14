import React from 'react'
import styles from './IconButton.module.scss'

type IconButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    icon: React.FC<React.SVGProps<SVGSVGElement>>
    disabled?: boolean
    variant?: 'filled' | 'outlined' | 'text' | 'tonal'
    iconColor?: string | 'inherit'
    iconSize?: number
    className?: string
}

function IconButton({icon: Icon, disabled = false, variant = 'text', iconColor, iconSize = 24, className, ...props}: IconButtonProps) {
    return (
    <button className={`${styles.iconButton} ${styles[variant]} ${className || ''}`} disabled={disabled} {...props}>
        <Icon height={iconSize} width={iconSize} color={iconColor || 'inherit'} />
    </button>
  )
}

export default IconButton