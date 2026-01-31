import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const { login } = useApp()

  function handleLogin(e) {
    e.preventDefault()
    login({ email, name: email.split('@')[0] || 'User' })
    navigate('/swipe')
  }

  function handleCreateAccount() {
    navigate('/onboarding')
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-card__logo">
          <img src="/logo.png" alt="OpenHeart Logo" />
        </div>

        <img src="/logo_text.png" alt="OpenHeart" className="login-card__text-logo" />
        <p>Dating built on empathy.</p>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Log In
          </button>
        </form>

        <div className="login-card__footer">
          Don&apos;t have an account?{' '}
          <button onClick={handleCreateAccount}>Create one</button>
        </div>
      </div>
    </div>
  )
}
