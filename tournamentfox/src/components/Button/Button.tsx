import React, { HTMLAttributes, SVGProps } from 'react'
import styles from './Button.module.scss'
import { ALoadingIcon } from '@/assets/icons'

type ButtonProps = HTMLAttributes<HTMLButtonElement> & {
    title?: string
    className?: string
    variant?: 'filled' | 'outlined' | 'text' | 'tonal'
    size?: 'small' | 'medium' | 'large'
    fullWidth?: boolean
    disabled?: boolean
    loading?: boolean
    error?: boolean
    success?: boolean
    icon?: React.FC<SVGProps<SVGSVGElement>>
    iconPosition?: 'left' | 'right'
    iconSize?: number
    iconColor?: string
}
function Button({ title, className, variant = 'filled', size = 'medium', fullWidth = false, disabled = false, loading = false, error = false, success = false, icon:Icon, iconPosition = 'left', iconSize = 24, iconColor = 'currentColor', ...props }: ButtonProps) {
  return (
    <button className={`${styles.button} ${styles[variant]} ${className ? className : ''}`} disabled={disabled} data-loading={loading} data-error={error} data-success={success} data-full-width={fullWidth} {...props}>
        {loading? <ALoadingIcon className={styles.icon} style={{ color: iconColor, width: iconSize, height: iconSize }} /> : Icon && <Icon style={{ color: iconColor, width: iconSize, height: iconSize }} />}
        {!loading && title}
    </button>
  )
}

export default Button