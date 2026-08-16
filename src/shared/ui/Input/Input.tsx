import { forwardRef } from 'react'

import { clsx } from 'clsx'

import styles from './Input.module.scss'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean
  leftSlot?: React.ReactNode
  rightSlot?: React.ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ invalid = false, leftSlot, rightSlot, className, disabled, ...rest }, ref) => {
    return (
      <div
        className={clsx(
          styles.wrapper,
          invalid && styles.invalid,
          disabled && styles.disabled,
          className,
        )}
      >
        {leftSlot && (
          <span className={styles.slot} aria-hidden="true">
            {leftSlot}
          </span>
        )}
        <input
          ref={ref}
          className={styles.input}
          disabled={disabled}
          aria-invalid={invalid || undefined}
          {...rest}
        />
        {rightSlot && (
          <span className={styles.slot} aria-hidden="true">
            {rightSlot}
          </span>
        )}
      </div>
    )
  },
)

Input.displayName = 'Input'
