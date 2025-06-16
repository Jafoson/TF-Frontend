import React, { useRef, useEffect, ReactNode } from 'react'
import styles from './Checkbox.module.scss'

type CheckboxItem = {
    value: boolean
    title: string
}

type CheckboxData = {
    [key: string]: boolean | CheckboxItem | CheckboxData
}

type CheckboxProps<T extends CheckboxData> = {
    data: T
    onChange: (newData: T) => void
    path?: string[]
}

function setAllChildren(obj: CheckboxData, checked: boolean): CheckboxData {
    const newObj: CheckboxData = {}
    for (const [key, value] of Object.entries(obj)) {
        if (typeof value === 'boolean') {
            newObj[key] = checked
        } else if ('value' in value) {
            newObj[key] = { ...value, value: checked }
        } else {
            newObj[key] = setAllChildren(value, checked)
        }
    }
    return newObj
}

function getAllValues(obj: CheckboxData): boolean[] {
    let values: boolean[] = []
    for (const value of Object.values(obj)) {
        if (typeof value === 'boolean') {
            values.push(value)
        } else if ('value' in value) {
            values.push((value as CheckboxItem).value)
        } else {
            values = values.concat(getAllValues(value as CheckboxData))
        }
    }
    return values
}

export default function Checkbox<T extends CheckboxData>({ data, onChange, path = [] }: CheckboxProps<T>) {
    const handleChange = (key: string, value: boolean | CheckboxItem | CheckboxData) => {
        const currentValue = data[key]
        let newValue: boolean | CheckboxItem | CheckboxData = value
        if (typeof currentValue === 'object' && !('value' in currentValue) && typeof value === 'boolean') {
            newValue = setAllChildren(currentValue as CheckboxData, value)
        }
        onChange({
            ...data,
            [key]: newValue
        } as T)
    }

    const handleNestedChange = (key: string, newNestedData: CheckboxData) => {
        onChange({
            ...data,
            [key]: newNestedData
        } as T)
    }

    const renderLabel = (key: string, value: boolean | CheckboxItem | CheckboxData): ReactNode => {
        if (typeof value === 'boolean') {
            return key
        } else if ('value' in value) {
            return (value as CheckboxItem).title
        }
        return key
    }

    return (
        <div className={styles.checkboxContainer}>
            {Object.entries(data).map(([key, value]) => {
                if (typeof value === 'boolean') {
                    return (
                        <div key={key} className={styles.checkbox}>
                            <div className={styles.checkboxRow}>
                                <input
                                    type="checkbox"
                                    id={`checkbox-${key}-${path.join('-')}`}
                                    checked={value}
                                    onChange={(e) => handleChange(key, e.target.checked)}
                                />
                                <label htmlFor={`checkbox-${key}-${path.join('-')}`}>{renderLabel(key, value)}</label>
                            </div>
                        </div>
                    )
                } else if ('value' in value) {
                    const checkboxItem = value as CheckboxItem
                    return (
                        <div key={key} className={styles.checkbox}>
                            <div className={styles.checkboxRow}>
                                <input
                                    type="checkbox"
                                    id={`checkbox-${key}-${path.join('-')}`}
                                    checked={checkboxItem.value}
                                    onChange={(e) => handleChange(key, { ...checkboxItem, value: e.target.checked })}
                                />
                                <label htmlFor={`checkbox-${key}-${path.join('-')}`}>{renderLabel(key, value)}</label>
                            </div>
                        </div>
                    )
                } else {
                    // Parent Checkbox mit Childs
                    const allValues = getAllValues(value as CheckboxData)
                    const allChecked = allValues.every(Boolean)
                    const someChecked = allValues.some(Boolean)
                    const ref = useRef<HTMLInputElement>(null)
                    useEffect(() => {
                        if (ref.current) {
                            ref.current.indeterminate = someChecked && !allChecked
                        }
                    }, [someChecked, allChecked])
                    return (
                        <div key={key} className={styles.checkbox}>
                            <div className={styles.checkboxRow}>
                                <input
                                    ref={ref}
                                    type="checkbox"
                                    id={`checkbox-${key}-${path.join('-')}`}
                                    checked={allChecked}
                                    onChange={(e) => handleChange(key, e.target.checked)}
                                />
                                <label htmlFor={`checkbox-${key}-${path.join('-')}`}>{renderLabel(key, value)}</label>
                            </div>
                            <div className={styles.nestedContent}>
                                <Checkbox
                                    data={value as CheckboxData}
                                    onChange={(newValue) => handleNestedChange(key, newValue)}
                                    path={[...path, key]}
                                />
                            </div>
                        </div>
                    )
                }
            })}
        </div>
    )
}
