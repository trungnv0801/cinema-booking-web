import { clsx } from 'clsx'

import styles from './MarqueeTicker.module.scss'

export interface MarqueeTickerProps {
  items: string[]
  className?: string
}

export function MarqueeTicker({ items, className }: MarqueeTickerProps) {
  return (
    <div className={clsx(styles.ticker, className)}>
      <ul className="visually-hidden">
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
      <div className={styles.track} aria-hidden="true">
        <TickerRow items={items} />
        <TickerRow items={items} />
      </div>
    </div>
  )
}

function TickerRow({ items }: { items: string[] }) {
  return (
    <div className={styles.row}>
      {items.map((item, index) => (
        <span key={index} className={styles.item}>
          {item}
          <span className={styles.divider} aria-hidden="true">
            &bull;
          </span>
        </span>
      ))}
    </div>
  )
}
