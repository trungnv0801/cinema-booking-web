import { useTranslation } from 'react-i18next'

import { Lock } from 'lucide-react'

import { useCinemas } from '@/entities/cinema'
import { useBranchScope } from '@/entities/session'
import { Select } from '@/shared/ui'

import styles from './BranchSelector.module.scss'

export function BranchSelector({ className }: { className?: string }) {
  const { t } = useTranslation(['common', 'staff-common'])
  const { data: cinemas } = useCinemas()
  const { allowed, selectedCinemaId, isLocked, setSelectedCinemaId } = useBranchScope()

  if (allowed !== 'ALL' && allowed.length === 0) return null

  if (isLocked) {
    const cinema = cinemas?.find((c) => c.id === selectedCinemaId)
    return (
      <div className={className ? `${styles.locked} ${className}` : styles.locked}>
        <Lock size={14} aria-hidden="true" />
        <span>
          {t('staff-common:branchLocked', { cinemaName: cinema?.name ?? t('brand.name') })}
        </span>
      </div>
    )
  }

  return (
    <Select
      className={className}
      value={selectedCinemaId ?? undefined}
      onValueChange={setSelectedCinemaId}
      options={(cinemas ?? []).map((cinema) => ({ value: cinema.id, label: cinema.name }))}
      placeholder={t('brand.name')}
      aria-label={t('brand.name')}
    />
  )
}
