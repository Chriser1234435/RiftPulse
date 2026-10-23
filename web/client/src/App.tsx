import { SignIn, SignUp, UserButton, useAuth, useUser } from '@clerk/react'
import { useEffect, useState } from 'react'
import { Link, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import './App.css'

const apiBase = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '')
const currentYear = new Date().getFullYear()

const features = [
  { number: '01', icon: '◌', title: 'Chat in the moment', text: 'Bring community messages closer to the action with an in-game chat experience.' },
  { number: '02', icon: '♫', title: 'Voice and sound cues', text: 'Shape how chat, stream events, and alerts fit into your gameplay.' },
  { number: '03', icon: '↗', title: 'Song requests', text: 'Build toward a smoother song-request flow with Beat Saber custom songs.' },
  { number: '04', icon: '文', title: 'More ways to connect', text: 'Plan for multilingual communities and a more accessible shared stream.' },
]

function Brand() {
  return (
    <Link className="brand-lockup" to="/" aria-label="RiftPulse home">
      <span className="brand-mark" aria-hidden="true"><span>R</span></span>
      <span>RiftPulse</span>
    </Link>
  )
}

function Header() {
  const { isSignedIn } = useAuth()
  return (
    <header className="site-header">
      <Brand />
      <nav className="main-nav" aria-label="Main navigation">
        <Link className="nav-link" to="/#features">Features</Link>
        <Link className="nav-link" to="/#plans">Plans</Link>
        {isSignedIn ? (
          <>
            <Link className="nav-link nav-dashboard" to="/dashboard">Dashboard</Link>
            <UserButton />
          </>
        ) : (
          <>
            <Link className="nav-link nav-sign-in" to="/sign-in">Sign in</Link>
            <Link className="button button-small" to="/sign-up">Create account <span aria-hidden="true">↗</span></Link>
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
          <span className="eyebrow"><span className="status-dot" /> BUILT FOR BEAT SABER STREAMERS</span>
          <h1>Your stream.<br /><span>Your rhythm.</span></h1>
          <p className="hero-description">
            RiftPulse is a streaming toolkit designed to bring your community
            into the game, with a clear path for PCVR and standalone Quest.
          </p>
          <div className="hero-actions">
            <Link className="button" to={isSignedIn ? '/dashboard' : '/sign-up'}>
              {isSignedIn ? 'Open dashboard' : 'Get started'} <span aria-hidden="true">→</span>
            </Link>
            <Link className="button button-quiet" to="/#features">Explore the toolkit <span aria-hidden="true">↓</span></Link>
          </div>
          <div className="trust-row">
            <span><span className="trust-check">✓</span> Free plan available</span>
            <span><span className="trust-check">✓</span> PCVR + Quest roadmap</span>
            <span><span className="trust-check">✓</span> Gameplay controls stay in-game</span>
          </div>
        </div>
        <div className="hero-visual" aria-label="Decorative RiftPulse signal illustration">
          <div className="visual-grid" />
          <div className="visual-orbit orbit-one" />
          <div className="visual-orbit orbit-two" />
          <div className="visual-orbit orbit-three" />
          <div className="visual-core"><span>R</span><i /><i /><i /></div>
          <div className="visual-chip chip-top"><span className="chip-dot" /> COMMUNITY FIRST</div>
          <div className="visual-chip chip-bottom"><span className="chip-bars">▮ ▮ ▮</span> STREAM / GAME / REPEAT</div>
          <span className="visual-label visual-label-left">LOW FRICTION</span>
          <span className="visual-label visual-label-right">ONE TOOLKIT</span>
        </div>
      </section>

      <section className="value-strip" aria-label="RiftPulse principles">
        <div><span className="value-icon">✳</span><span><strong>Made for the moment</strong><small>Community meets gameplay</small></span></div>
        <div><span className="value-icon">⌘</span><span><strong>One connected toolkit</strong><small>A clear home for your setup</small></span></div>
        <div><span className="value-icon">◈</span><span><strong>Controls where they belong</strong><small>Gameplay settings stay in-game</small></span></div>
      </section>

      <section className="content-section features-section" id="features">
        <div className="section-heading">
          <span className="eyebrow">THE TOOLKIT</span>
          <h2>More stream. Less friction.</h2>
          <p>Designed around the things that make a Beat Saber stream feel alive — and the community watching it.</p>
        </div>
        <div className="feature-grid">
          {features.map((feature) => (
            <article className="feature-card" key={feature.number}>
              <div className="feature-card-top"><span className="feature-icon">{feature.icon}</span><span className="feature-number">{feature.number}</span></div>
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
            </article>
          ))}
        </div>
        <p className="roadmap-note"><span aria-hidden="true">✦</span> RiftPulse is being built in stages. Platform connectors and individual features become available as their development steps are completed.</p>
      </section>

      <section className="workflow-section">
        <div className="section-heading section-heading-left">
          <span className="eyebrow">A CLEARER SETUP</span>
          <h2>Your stream, connected step by step.</h2>
          <p>Start with your account. Add the pieces of your setup as RiftPulse rolls them out.</p>
        </div>
        <div className="workflow-grid">
          <article className="workflow-step"><span className="workflow-number">01</span><div><h3>Create your account</h3><p>Use managed sign-in and keep your account details in one place.</p></div></article>
          <article className="workflow-step"><span className="workflow-number">02</span><div><h3>Connect your platforms</h3><p>Platform connection flows are part of the upcoming integration work.</p></div></article>
          <article className="workflow-step"><span className="workflow-number">03</span><div><h3>Take it into the game</h3><p>Gameplay module controls belong in the in-game RiftPulse Settings tab.</p></div></article>
        </div>
      </section>

      <section className="pricing-section content-section" id="plans">
        <div className="section-heading">
          <span className="eyebrow">SIMPLE PLANS</span>
          <h2>Start free. Upgrade when you're ready.</h2>
          <p>Transparent pricing from the start. Premium checkout is not enabled yet.</p>
        </div>
        <div className="pricing-grid">
          <article className="price-card">
            <div className="price-card-header"><span className="price-plan">Free</span><span className="price-tag">START HERE</span></div>
            <p className="price-description">A place to begin your RiftPulse setup.</p>
            <p className="price"><strong>$0</strong><span>/ month</span></p>
            <ul className="price-list"><li><span>✓</span> Create your RiftPulse account</li><li><span>✓</span> Access account dashboard</li><li><span>✓</span> Add features as they launch</li></ul>
            <Link className="button button-full" to={isSignedIn ? '/dashboard' : '/sign-up'}>{isSignedIn ? 'Open dashboard' : 'Create free account'} <span aria-hidden="true">→</span></Link>
          </article>
          <article className="price-card price-card-premium">
            <div className="price-card-header"><span className="price-plan">Premium</span><span className="price-tag price-tag-premium">PLANNED</span></div>
            <p className="price-description">More room for your streaming workflow.</p>
            <p className="price"><strong>$7.99</strong><span>/ month</span></p>
            <ul className="price-list"><li><span>✦</span> Premium feature set as announced</li><li><span>✦</span> Server-verified membership</li><li><span>✦</span> Clear plan and account status</li></ul>
            <span className="button button-full button-disabled" aria-disabled="true">Premium isn't available yet</span>
            <p className="price-footnote">No checkout or recurring payment is active.</p>
          </article>
        </div>
      </section>

      <section className="faq-section">
        <div className="section-heading section-heading-left">
          <span className="eyebrow">GOOD TO KNOW</span>
          <h2>Quick answers.</h2>
        </div>
        <div className="faq-list">
          <details><summary>Can I control gameplay modules on the website?</summary><p>No. Module toggles and gameplay controls belong in the in-game RiftPulse Settings tab. The website is for account and web-based setup tasks.</p></details>
          <details><summary>Is Premium available now?</summary><p>Not yet. Premium is planned at $7.99 per month, but checkout is not connected and no subscription payment is active.</p></details>
          <details><summary>Is the full PCVR and Quest toolkit finished?</summary><p>Not yet. RiftPulse is being built in stages. Support and integrations will be marked available as the relevant steps are implemented and tested.</p></details>
        </div>
      </section>

      <section className="closing-cta">
        <div><span className="eyebrow">YOUR COMMUNITY IS PART OF THE GAME</span><h2>Ready to find your rhythm?</h2><p>Set up your RiftPulse account and follow the build as new pieces come online.</p></div>
        <Link className="button" to={isSignedIn ? '/dashboard' : '/sign-up'}>{isSignedIn ? 'Go to dashboard' : 'Get started for free'} <span aria-hidden="true">→</span></Link>
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
  return <main className="not-found"><span className="eyebrow">404 · NOT FOUND</span><h1>Wrong turn.</h1><p>The page you’re looking for isn’t here.</p><Link className="button" to="/">Back to RiftPulse</Link></main>
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
      <footer className="site-footer">
        <Brand />
        <span>Built for the moment your stream meets the game.</span>
        <span>© {currentYear} RiftPulse</span>
      </footer>
    </div>
  )
}

export default App
