import { forwardRef } from 'react'

import { clsx } from 'clsx'

import styles from './IconButton.module.scss'

export type IconButtonVariant = 'solid' | 'outline' | 'ghost'
export type IconButtonSize = 'sm' | 'md' | 'lg'

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: IconButtonVariant
  size?: IconButtonSize
  'aria-label': string
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ variant = 'ghost', size = 'md', className, children, ...rest }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        className={clsx(styles.iconButton, styles[variant], styles[size], className)}
        {...rest}
      >
        {children}
      </button>
    )
  },
)

IconButton.displayName = 'IconButton'
