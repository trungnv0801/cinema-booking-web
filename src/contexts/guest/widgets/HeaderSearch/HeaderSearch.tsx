import { useState } from 'react'

import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import * as Dialog from '@radix-ui/react-dialog'
import { Search, X } from 'lucide-react'

import { useMovieSearch } from '@/entities/movie'
import { IconButton } from '@/shared/ui'

import styles from './HeaderSearch.module.scss'

export function HeaderSearch({ className }: { className?: string }) {
  const { t } = useTranslation('common')
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const { data, isFetching } = useMovieSearch(query)

  const term = query.trim()
  const hits = data?.items ?? []

  function handleOpenChange(next: boolean) {
    setOpen(next)
    if (!next) setQuery('')
  }

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Trigger asChild>
        <IconButton className={className} variant="ghost" aria-label={t('search.open')}>
          <Search size={18} />
        </IconButton>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className={styles.overlay} />
        <Dialog.Content className={styles.panel} aria-label={t('search.open')}>
          <Dialog.Title className="visually-hidden">{t('search.open')}</Dialog.Title>

          <div className={styles.bar}>
            <Search size={19} aria-hidden="true" />
            <input
              className={styles.input}
              type="search"
              autoComplete="off"
              autoFocus
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t('search.placeholder')}
              aria-label={t('search.open')}
            />
            <Dialog.Close asChild>
              <button type="button" className={styles.close} aria-label={t('actions.close')}>
                <X size={16} aria-hidden="true" />
              </button>
            </Dialog.Close>
          </div>

          <div className={styles.results} aria-live="polite" aria-label={t('search.results')}>
            {term.length < 2 && <p className={styles.empty}>{t('search.hint')}</p>}

            {term.length >= 2 &&
              hits.map((movie) => (
                <Link
                  key={movie.id}
                  to={`/movies/${movie.slug}`}
                  className={styles.hit}
                  onClick={() => handleOpenChange(false)}
                >
                  <img className={styles.thumb} src={movie.posterUrl} alt="" loading="lazy" />
                  <span>
                    <span className={styles.hitTitle}>{movie.title}</span>
                    <span className={styles.hitMeta}>
                      {movie.ageRating} · {movie.genres.map((genre) => genre.name).join(', ')}
                    </span>
                  </span>
                </Link>
              ))}

            {term.length >= 2 && !isFetching && hits.length === 0 && (
              <p className={styles.empty}>{t('search.empty', { query: term })}</p>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
