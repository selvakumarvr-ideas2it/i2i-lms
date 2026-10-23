import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { useAuth } from '@/auth/AuthContext'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { FieldError, Input, Label } from '@/components/ui/Input'
import { ROUTES } from '@/routes'

const schema = z.object({
  email: z.string().min(1, 'Email is required'),
  password: z.string().min(1, 'Password is required'),
})

type FormValues = z.infer<typeof schema>

export function LoginPage() {
  const { user, status, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [serverError, setServerError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  if (status === 'authenticated' && user) {
    const from = (location.state as { from?: Location })?.from
    const landsOnAdmin = user.role === 'ADMIN' || user.role === 'MANAGER'
    return <Navigate to={from?.pathname ?? (landsOnAdmin ? ROUTES.adminDashboard : ROUTES.dashboard)} replace />
  }

  const onSubmit = async (values: FormValues) => {
    setServerError(null)
    setSubmitting(true)
    try {
      await login(values.email, values.password)
      navigate(ROUTES.dashboard)
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Unable to sign in')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-md shadow-xl">
      <CardContent className="p-8">
        <h1 className="text-xl font-semibold text-ink">Sign in with your Ideas2IT account</h1>
        <p className="mt-1 text-sm text-muted">
          Use your @ideas2it.com email address. Access is limited to accounts your program administrator has added.
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div>
            <Label htmlFor="email">Ideas2IT email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="username"
              placeholder="firstname.lastname@ideas2it.com"
              aria-invalid={Boolean(errors.email)}
              {...register('email')}
            />
            <FieldError>{errors.email?.message}</FieldError>
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              aria-invalid={Boolean(errors.password)}
              {...register('password')}
            />
            <FieldError>{errors.password?.message}</FieldError>
          </div>

          {serverError && (
            <div role="alert" className="rounded-lg border border-danger-500/30 bg-danger-50 px-3 py-2 text-sm text-danger-600">
              {serverError}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? 'Signing in…' : 'Sign in'}
          </Button>
        </form>

        <div className="mt-6 rounded-lg bg-slate-50 p-3 text-xs text-muted">
          <p className="font-semibold text-ink">Demo accounts</p>
          <p className="mt-1">Admin: powerbi.admin@ideas2it.com</p>
          <p>Trainee: trainee01@ideas2it.com … trainee08@ideas2it.com</p>
          <p className="mt-1">Default password for every account: biviz2026@i2i (change it after signing in)</p>
        </div>
      </CardContent>
    </Card>
  )
}
