import { useTranslation } from 'react-i18next'

import { clsx } from 'clsx'
import { AlertCircle } from 'lucide-react'

import { Checkbox } from '../Checkbox'
import { Skeleton } from '../Skeleton'

import styles from './Table.module.scss'

export interface TableColumn<T> {
  id: string
  header: React.ReactNode
  cell: (row: T) => React.ReactNode
  numeric?: boolean
  width?: string
  sticky?: boolean
}

export type TableDensity = 'comfortable' | 'compact'

export interface TableProps<T> {
  columns: TableColumn<T>[]
  rows: T[]
  rowKey: (row: T) => string
  density?: TableDensity
  loading?: boolean
  error?: React.ReactNode
  onRetry?: () => void
  retryLabel?: string
  emptyMessage?: React.ReactNode
  emptyAction?: React.ReactNode
  selectable?: boolean
  selectedKeys?: ReadonlySet<string>
  onSelectedKeysChange?: (keys: Set<string>) => void
  selectAllLabel?: string
  selectRowLabel?: (row: T) => string
  bulkActions?: React.ReactNode
  onRowClick?: (row: T) => void
  skeletonRows?: number
  className?: string
}

export function Table<T>({
  columns,
  rows,
  rowKey,
  density = 'comfortable',
  loading = false,
  error,
  onRetry,
  retryLabel,
  emptyMessage,
  emptyAction,
  selectable = false,
  selectedKeys,
  onSelectedKeysChange,
  selectAllLabel,
  selectRowLabel,
  bulkActions,
  onRowClick,
  skeletonRows = 6,
  className,
}: TableProps<T>) {
  const { t } = useTranslation('common')
  const resolvedRetryLabel = retryLabel ?? t('actions.retry')
  const resolvedEmptyMessage = emptyMessage ?? t('table.noResults')
  const resolvedSelectAllLabel = selectAllLabel ?? t('actions.selectAll')
  const resolvedSelectRowLabel = selectRowLabel ?? (() => t('actions.selectRow'))
  const selected = selectedKeys ?? new Set<string>()
  const allSelected = rows.length > 0 && rows.every((row) => selected.has(rowKey(row)))
  const someSelected = !allSelected && rows.some((row) => selected.has(rowKey(row)))

  function toggleAll() {
    if (!onSelectedKeysChange) return
    onSelectedKeysChange(allSelected ? new Set() : new Set(rows.map(rowKey)))
  }

  function toggleRow(key: string) {
    if (!onSelectedKeysChange) return
    const next = new Set(selected)
    if (next.has(key)) next.delete(key)
    else next.add(key)
    onSelectedKeysChange(next)
  }

  function isStickyLeft(column: TableColumn<T>, index: number): boolean {
    return column.sticky || (index === 0 && !selectable)
  }

  return (
    <div className={clsx(styles.wrapper, className)}>
      <div className={styles.scroll} data-density={density}>
        <table className={styles.table}>
          <thead>
            <tr>
              {selectable && (
                <th className={clsx(styles.th, styles.checkboxCell, styles.stickyLeft)}>
                  <Checkbox
                    aria-label={resolvedSelectAllLabel}
                    checked={allSelected}
                    indeterminate={someSelected}
                    onChange={toggleAll}
                  />
                </th>
              )}
              {columns.map((column, index) => (
                <th
                  key={column.id}
                  className={clsx(
                    styles.th,
                    column.numeric && styles.numeric,
                    isStickyLeft(column, index) && styles.stickyLeft,
                  )}
                  style={{ width: column.width }}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: skeletonRows }, (_, rowIndex) => (
                <tr key={rowIndex}>
                  {selectable && (
                    <td className={clsx(styles.td, styles.checkboxCell, styles.stickyLeft)}>
                      <Skeleton variant="rect" width={18} height={18} />
                    </td>
                  )}
                  {columns.map((column) => (
                    <td key={column.id} className={styles.td}>
                      <Skeleton variant="text" width="70%" />
                    </td>
                  ))}
                </tr>
              ))
            ) : error ? (
              <tr>
                <td className={styles.stateCell} colSpan={columns.length + (selectable ? 1 : 0)}>
                  <div className={styles.state}>
                    <AlertCircle size={20} aria-hidden="true" />
                    <span>{error}</span>
                    {onRetry && (
                      <button type="button" className={styles.retry} onClick={onRetry}>
                        {resolvedRetryLabel}
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td className={styles.stateCell} colSpan={columns.length + (selectable ? 1 : 0)}>
                  <div className={styles.state}>
                    <span>{resolvedEmptyMessage}</span>
                    {emptyAction}
                  </div>
                </td>
              </tr>
            ) : (
              rows.map((row) => {
                const key = rowKey(row)
                return (
                  <tr
                    key={key}
                    className={clsx(onRowClick && styles.clickable)}
                    onClick={() => onRowClick?.(row)}
                    data-selected={selected.has(key) || undefined}
                  >
                    {selectable && (
                      <td
                        className={clsx(styles.td, styles.checkboxCell, styles.stickyLeft)}
                        onClick={(event) => event.stopPropagation()}
                      >
                        <Checkbox
                          aria-label={resolvedSelectRowLabel(row)}
                          checked={selected.has(key)}
                          onChange={() => toggleRow(key)}
                        />
                      </td>
                    )}
                    {columns.map((column, index) => (
                      <td
                        key={column.id}
                        className={clsx(
                          styles.td,
                          column.numeric && styles.numeric,
                          isStickyLeft(column, index) && styles.stickyLeft,
                        )}
                      >
                        {column.cell(row)}
                      </td>
                    ))}
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {selectable && selected.size > 0 && bulkActions && (
        <div className={styles.bulkBar}>
          <span className={styles.bulkCount}>{selected.size}</span>
          {bulkActions}
        </div>
      )}
    </div>
  )
}
