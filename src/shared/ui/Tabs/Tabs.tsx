import * as RadixTabs from '@radix-ui/react-tabs'

import styles from './Tabs.module.scss'

export interface TabItem {
  value: string
  label: React.ReactNode
  content?: React.ReactNode
  disabled?: boolean
}

export interface TabsProps {
  items: TabItem[]
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  'aria-label'?: string
}

export function Tabs({ items, value, defaultValue, onValueChange, ...rest }: TabsProps) {
  const hasContent = items.some((item) => item.content !== undefined)

  return (
    <RadixTabs.Root
      className={styles.root}
      value={value}
      defaultValue={defaultValue ?? items[0]?.value}
      onValueChange={onValueChange}
    >
      <RadixTabs.List className={styles.list} {...rest}>
        {items.map((item) => (
          <RadixTabs.Trigger
            key={item.value}
            value={item.value}
            disabled={item.disabled}
            className={styles.trigger}
          >
            {item.label}
          </RadixTabs.Trigger>
        ))}
      </RadixTabs.List>
      {hasContent &&
        items.map((item) => (
          <RadixTabs.Content key={item.value} value={item.value} className={styles.content}>
            {item.content}
          </RadixTabs.Content>
        ))}
    </RadixTabs.Root>
  )
}
