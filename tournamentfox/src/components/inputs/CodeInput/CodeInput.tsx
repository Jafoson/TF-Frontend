import React, { HTMLAttributes, useRef } from 'react'
import styles from './CodeInput.module.scss'

type CodeInputProps = Omit<HTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> & {
  length: number
  value: string
  onChange: (value: string) => void
  error?: boolean
  disabled?: boolean
}

function CodeInput({ length, value, onChange, error, disabled, ...props }: CodeInputProps) {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([])

  // Initialisiere das refs-Array
  React.useEffect(() => {
    inputsRef.current = inputsRef.current.slice(0, length)
  }, [length])

  const safeValue = value.padEnd(length, '')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    const val = e.target.value
    if (/^\d$/.test(val)) {
      const newValue = safeValue.substring(0, idx) + val + safeValue.substring(idx + 1)
      onChange(newValue)
      if (idx < length - 1) {
        inputsRef.current[idx + 1]?.focus()
      }
    } else if (val === '') {
      const newValue = safeValue.substring(0, idx) + '' + safeValue.substring(idx + 1)
      onChange(newValue)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
    if (e.key === 'Backspace') {
      if (safeValue[idx]) {
        // Aktuelles Feld löschen
        const newValue = safeValue.substring(0, idx) + '' + safeValue.substring(idx + 1)
        onChange(newValue)
      } else if (idx > 0) {
        // Zum vorherigen Feld springen und dieses löschen
        inputsRef.current[idx - 1]?.focus()
        const newValue = safeValue.substring(0, idx - 1) + '' + safeValue.substring(idx)
        onChange(newValue)
        setTimeout(() => {
          const prevInput = inputsRef.current[idx - 1]
          if (prevInput) {
            prevInput.setSelectionRange(1, 1)
          }
        }, 0)
        e.preventDefault()
      }
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const paste = e.clipboardData.getData('Text')
    const digits = paste.replace(/\D/g, '').slice(0, length)
    if (digits.length > 0) {
      onChange(digits.padEnd(length, ''))
      // Fokus auf das letzte ausgefüllte Feld setzen
      setTimeout(() => {
        const nextIdx = Math.min(digits.length, length - 1)
        inputsRef.current[nextIdx]?.focus()
      }, 0)
      e.preventDefault()
    }
  }

  return (
    <div className={styles.codeInputContainer}>
      {Array.from({ length }).map((_, idx) => (
        <input
          key={idx}
          ref={el => { inputsRef.current[idx] = el }}
          type="number"
          inputMode="numeric"
          maxLength={1}
          className={styles.codeInputBox}
          value={safeValue[idx] || ''}
          onChange={e => handleChange(e, idx)}
          onKeyDown={e => handleKeyDown(e, idx)}
          onPaste={handlePaste}
          data-error={error}
          disabled={disabled}
          {...props}
        />
      ))}
    </div>
  )
}

export default CodeInput