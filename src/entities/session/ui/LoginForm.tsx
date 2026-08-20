import { useState } from 'react'

import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff } from 'lucide-react'
import { z } from 'zod'

import { useAuth } from '@/entities/session/lib/useAuth'
import { isApiError } from '@/shared/api/types'
import { getErrorMessageKeyFromError } from '@/shared/i18n/error-key-map'
import { ROUTES } from '@/shared/routing/registry'
import { Button, FormField, IconButton, Input } from '@/shared/ui'

import styles from './LoginForm.module.scss'

const loginSchema = z.object({
  identifier: z.string().trim().min(1, 'validation.identifierRequired'),
  password: z.string().min(1, 'validation.passwordRequired'),
})

type LoginValues = z.infer<typeof loginSchema>

export interface LoginFormProps {
  onSuccess: () => void
  onNavigateAway?: () => void
}

export function LoginForm({ onSuccess, onNavigateAway }: LoginFormProps) {
  const { t } = useTranslation(['auth', 'errors'])
  const { login, isLoggingIn, loginError } = useAuth()
  const [passwordVisible, setPasswordVisible] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
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
        label={t('fields.identifier')}
        htmlFor="login-identifier"
        error={errors.identifier && t(errors.identifier.message ?? '')}
      >
        <Input
          id="login-identifier"
          type="text"
          autoComplete="username"
          autoFocus
          placeholder={t('fields.identifierPlaceholder')}
          invalid={Boolean(errors.identifier)}
          {...register('identifier')}
        />
      </FormField>

      <FormField
        label={t('fields.password')}
        htmlFor="login-password"
        error={errors.password && t(errors.password.message ?? '')}
      >
        <div className={styles.passwordField}>
          <Input
            id="login-password"
            className={styles.passwordInput}
            type={passwordVisible ? 'text' : 'password'}
            autoComplete="current-password"
            invalid={Boolean(errors.password)}
            {...register('password')}
          />
          <IconButton
            className={styles.reveal}
            size="sm"
            aria-label={t(passwordVisible ? 'actions.hidePassword' : 'actions.showPassword')}
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

      <Link className={styles.forgot} to={ROUTES.FORGOT_PASSWORD.path} onClick={onNavigateAway}>
        {t('actions.forgotPassword')}
      </Link>

      <Button type="submit" size="lg" fullWidth loading={isLoggingIn}>
        {t('signIn')}
      </Button>

      <p className={styles.foot}>
        <span>{t('login.noAccount')}</span>{' '}
        <Link to={ROUTES.REGISTER.path} onClick={onNavigateAway}>
          {t('actions.signUp')}
        </Link>
      </p>
    </form>
  )
}
