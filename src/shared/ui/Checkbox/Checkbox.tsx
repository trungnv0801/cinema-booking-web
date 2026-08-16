import { forwardRef, useEffect, useRef } from 'react'

import { clsx } from 'clsx'
import { Check, Minus } from 'lucide-react'

import styles from './Checkbox.module.scss'

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: React.ReactNode
  indeterminate?: boolean
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, indeterminate = false, className, id, ...rest }, forwardedRef) => {
    const innerRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
      if (innerRef.current) {
        innerRef.current.indeterminate = indeterminate
      }
    }, [indeterminate])

    return (
      <label className={clsx(styles.wrapper, rest.disabled && styles.disabled, className)}>
        <span className={styles.box}>
          <input
            ref={(node) => {
              innerRef.current = node
              if (typeof forwardedRef === 'function') forwardedRef(node)
              else if (forwardedRef) forwardedRef.current = node
            }}
            type="checkbox"
            id={id}
            className={styles.input}
            {...rest}
          />
          <span className={styles.indicator} aria-hidden="true">
            {indeterminate ? <Minus size={12} /> : <Check size={12} />}
          </span>
        </span>
        {label && <span className={styles.label}>{label}</span>}
      </label>
    )
  },
)

Checkbox.displayName = 'Checkbox'
