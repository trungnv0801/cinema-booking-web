import * as RadixSelect from '@radix-ui/react-select'
import { clsx } from 'clsx'
import { Check, ChevronDown } from 'lucide-react'

import styles from './Select.module.scss'

export interface SelectOption<T extends string = string> {
  value: T
  label: string
  disabled?: boolean
}

export interface SelectProps<T extends string = string> {
  value?: T
  defaultValue?: T
  onValueChange?: (value: T) => void
  options: SelectOption<T>[]
  placeholder?: string
  leftSlot?: React.ReactNode
  invalid?: boolean
  disabled?: boolean
  name?: string
  'aria-label'?: string
  className?: string
}

export function Select<T extends string = string>({
  value,
  defaultValue,
  onValueChange,
  options,
  placeholder,
  leftSlot,
  invalid = false,
  disabled = false,
  name,
  className,
  ...rest
}: SelectProps<T>) {
  return (
    <RadixSelect.Root
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange as (value: string) => void}
      disabled={disabled}
      name={name}
    >
      <RadixSelect.Trigger
        className={clsx(styles.trigger, invalid && styles.invalid, className)}
        aria-invalid={invalid || undefined}
        {...rest}
      >
        {leftSlot && (
          <span className={styles.slot} aria-hidden="true">
            {leftSlot}
          </span>
        )}
        <RadixSelect.Value placeholder={placeholder} />
        <RadixSelect.Icon className={styles.icon}>
          <ChevronDown size={16} />
        </RadixSelect.Icon>
      </RadixSelect.Trigger>
      <RadixSelect.Portal>
        <RadixSelect.Content className={styles.content} position="popper" sideOffset={4}>
          <RadixSelect.Viewport className={styles.viewport}>
            {options.map((option) => (
              <RadixSelect.Item
                key={option.value}
                value={option.value}
                disabled={option.disabled}
                className={styles.item}
              >
                <RadixSelect.ItemText>{option.label}</RadixSelect.ItemText>
                <RadixSelect.ItemIndicator className={styles.itemIndicator}>
                  <Check size={14} />
                </RadixSelect.ItemIndicator>
              </RadixSelect.Item>
            ))}
          </RadixSelect.Viewport>
        </RadixSelect.Content>
      </RadixSelect.Portal>
    </RadixSelect.Root>
  )
}
