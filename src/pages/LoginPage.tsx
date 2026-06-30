import type { FormEvent } from 'react'
import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../auth/AuthProvider'

type AuthMode = 'signin' | 'signup'

type LoginLocationState = {
  from?: {
    pathname?: string
  }
}

export function LoginPage() {
  const { session, isLoading } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [mode, setMode] = useState<AuthMode>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const state = location.state as LoginLocationState | null
  const redirectTo = state?.from?.pathname ?? '/'

  if (!isLoading && session) {
    return <Navigate to={redirectTo} replace />
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setMessage('')
    setIsSubmitting(true)

    const result =
      mode === 'signin'
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password })

    setIsSubmitting(false)

    if (result.error) {
      setError(result.error.message)
      return
    }

    if (mode === 'signin') {
      navigate(redirectTo, { replace: true })
      return
    }

    setMessage('Account created. Check your email if confirmation is enabled for this Supabase project.')
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-stone-50 px-4 py-10 text-slate-950">
      <section className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <p className="text-sm font-medium text-rose-700">HSK Companion</p>
          <h1 className="mt-2 text-3xl font-semibold">{mode === 'signin' ? 'Sign in' : 'Create account'}</h1>
        </div>

        <div className="mb-6 grid grid-cols-2 rounded-lg bg-stone-100 p-1">
          <button
            type="button"
            className={`rounded-md px-3 py-2 text-sm font-medium transition ${
              mode === 'signin' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-600 hover:text-slate-950'
            }`}
            onClick={() => setMode('signin')}
          >
            Sign in
          </button>
          <button
            type="button"
            className={`rounded-md px-3 py-2 text-sm font-medium transition ${
              mode === 'signup' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-600 hover:text-slate-950'
            }`}
            onClick={() => setMode('signup')}
          >
            Sign up
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">Email</span>
            <Input
              autoComplete="email"
              inputMode="email"
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              required
              type="email"
              value={email}
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">Password</span>
            <Input
              autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
              minLength={6}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="At least 6 characters"
              required
              type="password"
              value={password}
            />
          </label>

          {error ? <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
          {message ? <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{message}</p> : null}

          <Button className="w-full" disabled={isSubmitting} type="submit">
            {isSubmitting ? 'Working...' : mode === 'signin' ? 'Sign in' : 'Sign up'}
          </Button>
        </form>
      </section>
    </main>
  )
}
