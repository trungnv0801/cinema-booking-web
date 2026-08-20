import { useState } from 'react'

import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff } from 'lucide-react'
import { z } from 'zod'

import { useAuth } from '@/entities/session/lib/useAuth'
import { isApiError } from '@/shared/api/types'
import { getErrorMessageKeyFromError } from '@/shared/i18n/error-key-map'
import { Button, FormField, IconButton, Input } from '@/shared/ui'

import styles from './StaffLoginForm.module.scss'

const staffLoginSchema = z.object({
  identifier: z
    .string()
    .trim()
    .min(1, 'login.validation.emailRequired')
    .email('login.validation.emailInvalid'),
  password: z.string().min(1, 'auth:validation.passwordRequired'),
})

type StaffLoginValues = z.infer<typeof staffLoginSchema>

export interface StaffLoginFormProps {
  onSuccess: () => void
}

export function StaffLoginForm({ onSuccess }: StaffLoginFormProps) {
  const { t } = useTranslation(['staff-common', 'auth', 'errors'])
  const { login, isLoggingIn, loginError } = useAuth()
  const [passwordVisible, setPasswordVisible] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StaffLoginValues>({
    resolver: zodResolver(staffLoginSchema),
    defaultValues: { identifier: '', password: '' },
  })

  const onSubmit = handleSubmit(async (values) => {
    try {
      await login(values)
      onSuccess()
    } catch {
      /* Rendered from loginError below — the mutation already holds it. */
    }
  })

  const submitError = loginError
    ? isApiError(loginError)
      ? t(getErrorMessageKeyFromError(loginError))
      : t('errors:fallback')
    : null

  return (
    <form className={styles.form} onSubmit={onSubmit} noValidate>
      <FormField
        label={t('login.email')}
        htmlFor="staff-login-identifier"
        error={errors.identifier && t(errors.identifier.message ?? '')}
      >
        <Input
          id="staff-login-identifier"
          type="email"
          autoComplete="username"
          autoFocus
          placeholder={t('login.emailPlaceholder')}
          invalid={Boolean(errors.identifier)}
          {...register('identifier')}
        />
      </FormField>

      <FormField
        label={t('auth:fields.password')}
        htmlFor="staff-login-password"
        error={errors.password && t(errors.password.message ?? '')}
      >
        <div className={styles.passwordField}>
          <Input
            id="staff-login-password"
            className={styles.passwordInput}
            type={passwordVisible ? 'text' : 'password'}
            autoComplete="current-password"
            invalid={Boolean(errors.password)}
            {...register('password')}
          />
          <IconButton
            className={styles.reveal}
            size="sm"
            aria-label={t(
              passwordVisible ? 'auth:actions.hidePassword' : 'auth:actions.showPassword',
            )}
            aria-pressed={passwordVisible}
            onClick={() => setPasswordVisible((visible) => !visible)}
          >
            {passwordVisible ? <EyeOff size={17} /> : <Eye size={17} />}
          </IconButton>
        </div>
      </FormField>

      {submitError && (
        <p className={styles.formError} role="alert">
          {submitError}
        </p>
      )}

      <Button type="submit" size="lg" fullWidth loading={isLoggingIn}>
        {t('auth:signIn')}
      </Button>
    </form>
  )
}
