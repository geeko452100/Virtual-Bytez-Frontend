import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { cn } from '../lib/cn'
import Button from '../components/ui/Button'

export default function LoginPage() {
  const { signIn, signUp, authError, isConfigured, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from ?? '/account'

  const [mode, setMode] = useState('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  if (isAuthenticated) {
    return <Navigate to={from} replace />
  }

  if (!isConfigured) {
    return (
      <div className="grid min-h-[50vh] place-items-center">
        <div className="panel w-full max-w-[420px] p-8 text-left">
          <h1>Supabase required</h1>
          <p>Copy .env.example to .env and add your Supabase project credentials.</p>
          <Link to="/">Back home</Link>
        </div>
      </div>
    )
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    if (mode === 'signin') {
      const { error } = await signIn({ email, password })
      setLoading(false)
      if (!error) navigate(from, { replace: true })
    } else {
      const { error } = await signUp({ email, password, fullName })
      setLoading(false)
      if (!error) {
        setMessage('Check your email to confirm your account, then sign in.')
        setMode('signin')
      }
    }
  }

  return (
    <div className="grid min-h-[50vh] place-items-center">
      <div className="panel w-full max-w-[420px] p-8 text-left">
        <h1>{mode === 'signin' ? 'Sign in' : 'Create account'}</h1>
        <p className="my-2 mb-5 text-text-muted">
          {mode === 'signin'
            ? 'Access saved builds and order history.'
            : 'Join Circut Revive to save custom builds and checkout.'}
        </p>

        <div className="mb-5 flex gap-2">
          <button
            type="button"
            className={cn('filter-chip', mode === 'signin' && 'filter-chip-active')}
            onClick={() => setMode('signin')}
          >
            Sign in
          </button>
          <button
            type="button"
            className={cn('filter-chip', mode === 'signup' && 'filter-chip-active')}
            onClick={() => setMode('signup')}
          >
            Sign up
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {mode === 'signup' && (
            <label className="form-label">
              Full name
              <input
                className="form-input"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                autoComplete="name"
              />
            </label>
          )}
          <label className="form-label">
            Email
            <input
              className="form-input"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </label>
          <label className="form-label">
            Password
            <input
              className="form-input"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
            />
          </label>

          {(authError || message) && (
            <p className={cn('text-sm', authError ? 'text-danger' : 'text-phosphor')}>
              {authError || message}
            </p>
          )}

          <Button type="submit" variant="primary" size="lg" className="w-full" disabled={loading}>
            {loading ? 'Please wait…' : mode === 'signin' ? 'Sign in' : 'Create account'}
          </Button>
        </form>
      </div>
    </div>
  )
}
