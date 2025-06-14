import React from 'react'
import { HTMLAttributes } from 'react'
import styles from './Checkbox.module.scss'

type CheckboxProps = HTMLAttributes<HTMLInputElement> & {
    label: string
}

export default function Checkbox({label, ...props}: CheckboxProps) {
  return (
    <div className={styles.checkbox}>
        <input type="checkbox" {...props} />
        <label>{label}</label>
    </div>
  ) 
}
