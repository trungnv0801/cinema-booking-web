import { clsx } from 'clsx'

import styles from './RadioGroup.module.scss'

export interface RadioOption<T extends string = string> {
  value: T
  label: React.ReactNode
  disabled?: boolean
}

export interface RadioGroupProps<T extends string = string> {
  name: string
  value?: T
  defaultValue?: T
  onValueChange?: (value: T) => void
  options: RadioOption<T>[]
  disabled?: boolean
  orientation?: 'vertical' | 'horizontal'
  'aria-label'?: string
  className?: string
}

export function RadioGroup<T extends string = string>({
  name,
  value,
  defaultValue,
  onValueChange,
  options,
  disabled = false,
  orientation = 'vertical',
  className,
  ...rest
}: RadioGroupProps<T>) {
  return (
    <div role="radiogroup" className={clsx(styles.group, styles[orientation], className)} {...rest}>
      {options.map((option) => {
        const isDisabled = disabled || option.disabled
        return (
          <label key={option.value} className={clsx(styles.item, isDisabled && styles.disabled)}>
            <span className={styles.radio}>
              <input
                type="radio"
                name={name}
                value={option.value}
                disabled={isDisabled}
                checked={value !== undefined ? value === option.value : undefined}
                defaultChecked={value === undefined ? defaultValue === option.value : undefined}
                onChange={() => onValueChange?.(option.value)}
                className={styles.input}
              />
              <span className={styles.indicator} aria-hidden="true" />
            </span>
            <span className={styles.label}>{option.label}</span>
          </label>
        )
      })}
    </div>
  )
}
