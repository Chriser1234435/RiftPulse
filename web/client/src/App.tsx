import { SignIn, SignUp, UserButton, useAuth, useUser } from '@clerk/react'
import { useEffect, useState } from 'react'
import { Link, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import './App.css'

const apiBase = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '')
const currentYear = new Date().getFullYear()

function Brand() {
  return (
    <Link className="brand-lockup" to="/" aria-label="RiftPulse home">
      <span className="brand-mark">R</span>
      <span>RiftPulse</span>
    </Link>
  )
}

function Header() {
  const { isSignedIn } = useAuth()
  return (
    <header className="site-header">
      <Brand />
      <nav aria-label="Main navigation">
        {isSignedIn ? (
          <>
            <Link className="nav-link" to="/dashboard">Dashboard</Link>
            <UserButton />
          </>
        ) : (
          <>
            <Link className="nav-link" to="/sign-in">Sign in</Link>
            <Link className="button button-small" to="/sign-up">Create account</Link>
          </>
        )}
      </nav>
    </header>
  )
}

function Home() {
  const { isSignedIn } = useAuth()
  return (
    <main>
      <section className="hero-section">
        <div className="hero-copy">
          <span className="eyebrow"><span className="status-dot" /> THE STREAMING SUITE FOR BEAT SABER</span>
          <h1>Your stream.<br /><span>Your rhythm.</span></h1>
          <p className="hero-description">
            Bring your community into the game with one connected streaming
            toolkit, built for PCVR and Quest.
          </p>
          <div className="hero-actions">
            <Link className="button" to={isSignedIn ? '/dashboard' : '/sign-up'}>
              {isSignedIn ? 'Open dashboard' : 'Get started'} <span aria-hidden="true">→</span>
            </Link>
            <Link className="button button-quiet" to="/sign-in">I already have an account</Link>
          </div>
          <div className="trust-row">
            <span><span className="trust-check">✓</span> Free plan available</span>
            <span><span className="trust-check">✓</span> PCVR + Quest</span>
            <span><span className="trust-check">✓</span> Your settings, your control</span>
          </div>
        </div>
        <div className="hero-visual" aria-hidden="true">
          <div className="visual-orbit orbit-one" />
          <div className="visual-orbit orbit-two" />
          <div className="visual-core"><span>R</span><i /><i /><i /></div>
          <div className="visual-chip chip-top"><span className="chip-dot" /> CHAT CONNECTED</div>
          <div className="visual-chip chip-bottom"><span className="chip-bars">▮ ▮ ▮</span> COMMUNITY LIVE</div>
        </div>
      </section>
      <section className="auth-value-row">
        <div><span className="value-number">01</span><h2>One account</h2><p>Keep your RiftPulse identity in one secure place.</p></div>
        <div><span className="value-number">02</span><h2>Made for your setup</h2><p>Manage your account and platform connections on the web.</p></div>
        <div><span className="value-number">03</span><h2>Built with boundaries</h2><p>Gameplay module controls stay in the in-game Settings tab.</p></div>
      </section>
    </main>
  )
}

function AuthPage({ mode }: { mode: 'sign-in' | 'sign-up' }) {
  const location = useLocation()
  const { isLoaded, isSignedIn } = useAuth()
  if (isLoaded && isSignedIn) return <Navigate to="/dashboard" replace state={{ from: location.pathname }} />
  return (
    <main className="auth-page">
      <div className="auth-intro">
        <span className="eyebrow">WELCOME TO RIFTPULSE</span>
        <h1>{mode === 'sign-in' ? 'Good to have you back.' : 'Find your flow.'}</h1>
        <p>{mode === 'sign-in' ? 'Sign in to manage your RiftPulse account.' : 'Create your account to get your streaming setup connected.'}</p>
        <div className="auth-note"><span className="note-icon">✓</span><span>Protected account access<br /><small>Your private account details stay behind authentication.</small></span></div>
      </div>
      <div className="auth-widget">
        {mode === 'sign-in' ? <SignIn routing="path" path="/sign-in" signUpUrl="/sign-up" /> : <SignUp routing="path" path="/sign-up" signInUrl="/sign-in" />}
      </div>
    </main>
  )
}

type ApiResult = { status: 'loading' | 'ok' | 'unauthorized' | 'error'; message: string; userId?: string }

function Dashboard() {
  const { isLoaded, isSignedIn, getToken } = useAuth()
  const { user } = useUser()
  const [apiResult, setApiResult] = useState<ApiResult>({ status: 'loading', message: 'Checking the protected API…' })

  useEffect(() => {
    let cancelled = false
    async function checkApi() {
      if (!isLoaded || !isSignedIn) return
      try {
        const token = await getToken()
        if (!token) {
          if (!cancelled) setApiResult({ status: 'unauthorized', message: 'No active session token was provided.' })
          return
        }
        const response = await fetch(`${apiBase}/api/me`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const body = await response.json().catch(() => ({}))
        if (cancelled) return
        if (response.ok && body.authenticated === true) {
          setApiResult({ status: 'ok', message: 'The API verified your session.', userId: body.user?.userId })
        } else if (response.status === 401) {
          setApiResult({ status: 'unauthorized', message: 'The API did not accept this session. Check the configured API keys and origins.' })
        } else {
          setApiResult({ status: 'error', message: body.error ?? 'The protected API is not configured yet.' })
        }
      } catch {
        if (!cancelled) setApiResult({ status: 'error', message: 'The API could not be reached. The website session is separate from API availability.' })
      }
    }
    void checkApi()
    return () => { cancelled = true }
  }, [getToken, isLoaded, isSignedIn])

  if (!isLoaded) return <main className="loading-state">Loading your account…</main>
  if (!isSignedIn) return <Navigate to="/sign-in" replace />

  const displayName = user?.firstName || user?.username || 'there'
  const email = user?.primaryEmailAddress?.emailAddress ?? 'Email not available'

  return (
    <main className="dashboard">
      <div className="dashboard-heading">
        <div><span className="eyebrow">YOUR ACCOUNT</span><h1>Welcome back, {displayName}.</h1><p>Here’s the current state of your RiftPulse account.</p></div>
        <UserButton />
      </div>
      <section className="dashboard-grid">
        <article className="panel profile-panel">
          <div className="panel-heading"><span className="panel-icon">◉</span><div><h2>Account profile</h2><p>Your signed-in identity</p></div></div>
          <div className="profile-row"><span className="profile-avatar">{displayName.slice(0, 1).toUpperCase()}</span><div><strong>{user?.fullName || displayName}</strong><p>{email}</p></div></div>
          <div className="detail-row"><span>Authentication</span><span className="state-pill"><i /> Signed in</span></div>
          <div className="detail-row"><span>Account ID</span><code>{user?.id ?? 'Unavailable'}</code></div>
        </article>
        <article className="panel plan-panel">
          <div className="panel-heading"><span className="panel-icon">✦</span><div><h2>Current plan</h2><p>Your RiftPulse membership</p></div></div>
          <div className="plan-name">Free <span>$0 / month</span></div>
          <p className="panel-copy">Your account starts on the Free plan. Premium is planned at $7.99/month and will only unlock through verified server-side subscription status.</p>
          <span className="coming-soon">BILLING NOT CONNECTED</span>
        </article>
        <article className="panel api-panel">
          <div className="panel-heading"><span className="panel-icon">⌘</span><div><h2>Protected API</h2><p>Independent server-side verification</p></div></div>
          <div className={`api-state api-${apiResult.status}`}><i />{apiResult.status === 'ok' ? 'Verified' : apiResult.status === 'loading' ? 'Checking' : apiResult.status === 'unauthorized' ? 'Not authorized' : 'Unavailable'}</div>
          <p className="panel-copy">{apiResult.message}</p>
          {apiResult.userId && <div className="detail-row"><span>Verified user ID</span><code>{apiResult.userId}</code></div>}
        </article>
        <article className="panel next-panel">
          <div className="panel-heading"><span className="panel-icon">↗</span><div><h2>Next for your setup</h2><p>Account foundation only</p></div></div>
          <ul className="next-list">
            <li><span className="list-check">✓</span><div><strong>Secure sign-in foundation</strong><p>Managed authentication and session controls</p></div></li>
            <li><span className="list-pending">02</span><div><strong>Connect your platforms</strong><p>Available in a later approved step</p></div></li>
            <li><span className="list-pending">03</span><div><strong>Pair your game client</strong><p>Available in a later approved step</p></div></li>
          </ul>
        </article>
      </section>
    </main>
  )
}

function NotFound() {
  return <main className="not-found"><span className="eyebrow">404 · NOT FOUND</span><h1>Wrong turn.</h1><Link className="button" to="/">Back to RiftPulse</Link></main>
}

function App() {
  return (
    <div className="app-shell">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-in/*" element={<AuthPage mode="sign-in" />} />
        <Route path="/sign-up/*" element={<AuthPage mode="sign-up" />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <footer className="site-footer"><Brand /><span>Built for the moment your stream meets the game.</span><span>© {currentYear} RiftPulse</span></footer>
    </div>
  )
}

export default App
