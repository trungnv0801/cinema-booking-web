import { useTranslation } from 'react-i18next'

import { ChevronLeft, ChevronRight } from 'lucide-react'

import { IconButton } from '../IconButton'

import styles from './Pagination.module.scss'

export interface PaginationProps {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  siblingCount?: number
  previousLabel?: string
  nextLabel?: string
  pageLabel?: (page: number) => string
}

export function Pagination({
  page,
  totalPages,
  onPageChange,
  siblingCount = 1,
  previousLabel,
  nextLabel,
  pageLabel,
}: PaginationProps) {
  const { t } = useTranslation('common')
  if (totalPages <= 1) return null

  const resolvedPreviousLabel = previousLabel ?? t('pagination.previousPage')
  const resolvedNextLabel = nextLabel ?? t('pagination.nextPage')
  const resolvedPageLabel = pageLabel ?? ((n: number) => t('pagination.page', { number: n }))
  const pages = buildPageList(page, totalPages, siblingCount)

  return (
    <nav className={styles.nav} aria-label="Pagination">
      <IconButton
        aria-label={resolvedPreviousLabel}
        variant="outline"
        size="sm"
        disabled={page === 0}
        onClick={() => onPageChange(page - 1)}
      >
        <ChevronLeft size={16} />
      </IconButton>

      <ul className={styles.list}>
        {pages.map((entry, index) =>
          entry === 'ellipsis' ? (
            <li key={`ellipsis-${index}`} className={styles.ellipsis} aria-hidden="true">
              &hellip;
            </li>
          ) : (
            <li key={entry}>
              <button
                type="button"
                className={styles.pageButton}
                data-active={entry === page || undefined}
                aria-current={entry === page ? 'page' : undefined}
                aria-label={resolvedPageLabel(entry + 1)}
                onClick={() => onPageChange(entry)}
              >
                {entry + 1}
              </button>
            </li>
          ),
        )}
      </ul>

      <IconButton
        aria-label={resolvedNextLabel}
        variant="outline"
        size="sm"
        disabled={page >= totalPages - 1}
        onClick={() => onPageChange(page + 1)}
      >
        <ChevronRight size={16} />
      </IconButton>
    </nav>
  )
}

function buildPageList(
  page: number,
  totalPages: number,
  siblingCount: number,
): (number | 'ellipsis')[] {
  const totalVisible = siblingCount * 2 + 5
  if (totalPages <= totalVisible) {
    return Array.from({ length: totalPages }, (_, i) => i)
  }

  const left = Math.max(page - siblingCount, 1)
  const right = Math.min(page + siblingCount, totalPages - 2)
  const hasLeftGap = left > 1
  const hasRightGap = right < totalPages - 2

  const edgeRunLength = siblingCount * 2 + 3

  if (!hasLeftGap && hasRightGap) {
    return [...range(0, edgeRunLength - 1), 'ellipsis', totalPages - 1]
  }

  if (hasLeftGap && !hasRightGap) {
    return [0, 'ellipsis', ...range(totalPages - edgeRunLength, totalPages - 1)]
  }

  return [0, 'ellipsis', ...range(left, right), 'ellipsis', totalPages - 1]
}

function range(start: number, end: number): number[] {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
}
