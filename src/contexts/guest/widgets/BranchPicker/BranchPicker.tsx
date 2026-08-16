import { useState } from 'react'

import { useTranslation } from 'react-i18next'

import { clsx } from 'clsx'
import { Check, ChevronDown, MapPin } from 'lucide-react'

import { useBranchPreferenceStore } from '@/contexts/guest/model/branch-preference.store'
import { useCinemas } from '@/entities/cinema'
import { Button, Modal } from '@/shared/ui'

import styles from './BranchPicker.module.scss'

export function BranchPicker({ className }: { className?: string }) {
  const { t } = useTranslation('common')
  const [open, setOpen] = useState(false)
  const { data: cinemas } = useCinemas()
  const preferredCinemaId = useBranchPreferenceStore((s) => s.preferredCinemaId)
  const setPreferredCinemaId = useBranchPreferenceStore((s) => s.setPreferredCinemaId)

  const branches = cinemas ?? []
  const selected = branches.find((cinema) => cinema.id === preferredCinemaId)

  return (
    <>
      <button
        type="button"
        className={clsx(styles.trigger, className)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={t('branch.aria')}
        onClick={() => setOpen(true)}
      >
        <MapPin size={15} aria-hidden="true" />
        <span className={styles.triggerName}>{selected?.name ?? t('branch.choose')}</span>
        <span className={styles.triggerCode}>{selected?.code ?? '··'}</span>
        <ChevronDown className={styles.chevron} size={13} aria-hidden="true" />
      </button>

      <Modal
        open={open}
        onOpenChange={setOpen}
        size="sm"
        title={t('branch.pickTitle')}
        description={t('branch.pickDescription')}
        footer={
          <Button variant="ghost" fullWidth onClick={() => setOpen(false)}>
            {t('actions.cancel')}
          </Button>
        }
      >
        <div role="radiogroup" aria-label={t('branch.pickTitle')} className={styles.options}>
          {branches.map((cinema) => (
            <button
              key={cinema.id}
              type="button"
              role="radio"
              aria-checked={cinema.id === preferredCinemaId}
              className={styles.option}
              onClick={() => {
                setPreferredCinemaId(cinema.id)
                setOpen(false)
              }}
            >
              <span className={styles.optionCode}>{cinema.code}</span>
              <span>
                <span className={styles.optionName}>{cinema.name}</span>
                <span className={styles.optionAddress}>{cinema.address}</span>
              </span>
              <Check className={styles.tick} size={16} aria-hidden="true" />
            </button>
          ))}
        </div>
      </Modal>
    </>
  )
}
