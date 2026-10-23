import { SignIn, SignUp, UserButton, useAuth, useUser } from '@clerk/react'
import { useCallback, useEffect, useState } from 'react'
import { Link, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { ArrowDown, ArrowRight, ArrowUpRight, AudioLines, Check, Gamepad2, Globe2, ListChecks, Monitor, Music2, Radio, ShieldCheck, Sparkles, UserRound, Waves, CreditCard } from 'lucide-react'
import './App.css'

const apiBase = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '')
const currentYear = new Date().getFullYear()

const features = [
  { number: '01', icon: <Radio />, title: 'Chat in the moment', text: 'Bring community messages closer to the action with an in-game chat experience.' },
  { number: '02', icon: <AudioLines />, title: 'Voice and sound cues', text: 'Shape how chat, stream events, and alerts fit into your gameplay.' },
  { number: '03', icon: <Music2 />, title: 'Song requests', text: 'Build toward a smoother song-request flow with Beat Saber custom songs.' },
  { number: '04', icon: <Globe2 />, title: 'More ways to connect', text: 'Plan for multilingual communities and a more accessible shared stream.' },
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
        <Link className="nav-link nav-features" to="/#features">Features</Link>
        <Link className="nav-link nav-plans" to="/#plans">Plans</Link>
        {isSignedIn ? (
          <>
            <Link className="nav-link nav-dashboard" to="/dashboard">Dashboard</Link>
            <UserButton />
          </>
        ) : (
          <>
            <Link className="nav-link nav-sign-in" to="/sign-in">Sign in</Link>
            <Link className="button button-small" to="/sign-up">Create account <ArrowUpRight aria-hidden="true" /></Link>
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
            Bring your community into the game with one streaming toolkit
            built for PCVR and standalone Quest.
          </p>
          <div className="hero-actions">
            <Link className="button" to={isSignedIn ? '/dashboard' : '/sign-up'}>
              {isSignedIn ? 'Open dashboard' : 'Get started'} <ArrowRight aria-hidden="true" />
            </Link>
            <Link className="button button-quiet" to="/#features">Explore the toolkit <ArrowDown aria-hidden="true" /></Link>
          </div>
          <div className="trust-row">
            <span><Check className="trust-check" aria-hidden="true" /> Free plan available</span>
            <span><Check className="trust-check" aria-hidden="true" /> PCVR + Quest roadmap</span>
            <span><Check className="trust-check" aria-hidden="true" /> Gameplay controls stay in-game</span>
          </div>
        </div>
        <div className="hero-visual" aria-label="Decorative RiftPulse signal illustration">
          <div className="visual-grid" />
          <div className="visual-orbit orbit-one" />
          <div className="visual-orbit orbit-two" />
          <div className="visual-orbit orbit-three" />
          <div className="visual-core"><span>R</span><i /><i /><i /></div>
          <div className="visual-chip chip-top"><span className="chip-dot" /> COMMUNITY FIRST</div>
          <div className="visual-chip chip-bottom"><span className="chip-bars" aria-hidden="true"><Waves /></span> STREAM / GAME / REPEAT</div>
          <span className="visual-label visual-label-left">LOW FRICTION</span>
          <span className="visual-label visual-label-right">ONE TOOLKIT</span>
        </div>
      </section>

      <section className="value-strip" aria-label="RiftPulse principles">
        <div><span className="value-icon"><Sparkles aria-hidden="true" /></span><span><strong>Made for the moment</strong><small>Community meets gameplay</small></span></div>
        <div><span className="value-icon"><UserRound aria-hidden="true" /></span><span><strong>One connected toolkit</strong><small>A clear home for your setup</small></span></div>
        <div><span className="value-icon"><Gamepad2 aria-hidden="true" /></span><span><strong>Controls where they belong</strong><small>Gameplay settings stay in-game</small></span></div>
      </section>

      <section className="content-section features-section" id="features">
        <div className="section-heading">
          <span className="eyebrow">THE TOOLKIT</span>
          <h2>More stream. Less friction.</h2>
          <p>Designed around the things that make a Beat Saber stream feel alive â€” and the community watching it.</p>
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
        <p className="roadmap-note"><Sparkles aria-hidden="true" /> RiftPulse is being built in stages. Platform connectors and individual features become available as their development steps are completed.</p>
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
            <ul className="price-list"><li><span><Check aria-hidden="true" /></span> Create your RiftPulse account</li><li><span><Check aria-hidden="true" /></span> Access account dashboard</li><li><span><Check aria-hidden="true" /></span> Add features as they launch</li></ul>
            <Link className="button button-full" to={isSignedIn ? '/dashboard' : '/sign-up'}>{isSignedIn ? 'Open dashboard' : 'Create free account'} <ArrowRight aria-hidden="true" /></Link>
          </article>
          <article className="price-card price-card-premium">
            <div className="price-card-header"><span className="price-plan">Premium</span><span className="price-tag price-tag-premium">PLANNED</span></div>
            <p className="price-description">More room for your streaming workflow.</p>
            <p className="price"><strong>$7.99</strong><span>/ month</span></p>
            <ul className="price-list"><li><span><Sparkles aria-hidden="true" /></span> Premium feature set as announced</li><li><span><Check aria-hidden="true" /></span> Server-verified membership</li><li><span><Check aria-hidden="true" /></span> Clear plan and account status</li></ul>
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
        <Link className="button" to={isSignedIn ? '/dashboard' : '/sign-up'}>{isSignedIn ? 'Go to dashboard' : 'Get started for free'} <ArrowRight aria-hidden="true" /></Link>
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
        <div className="auth-note"><span className="note-icon"><ShieldCheck aria-hidden="true" /></span><span>Protected account access<br /><small>Your private account details stay behind authentication.</small></span></div>
      </div>
      <div className="auth-widget">
        {mode === 'sign-in' ? <SignIn routing="path" path="/sign-in" signUpUrl="/sign-up" /> : <SignUp routing="path" path="/sign-up" signInUrl="/sign-in" />}
      </div>
    </main>
  )
}

type ApiResult = { status: 'loading' | 'ok' | 'unauthorized' | 'error'; message: string; userId?: string }
type Installation = { id: string; client_platform: 'pcvr' | 'quest'; display_name: string; status: 'pending' | 'paired' | 'revoked'; paired_at?: string | null; last_seen_at?: string | null; created_at?: string }
type PlatformConnection = { id: string; provider: 'twitch' | 'youtube' | 'tiktok_live' | 'kick'; status: 'pending' | 'connected' | 'revoked' | 'error' }
type WebPreferences = { locale?: string; productUpdates?: boolean }
const providerNames: Record<PlatformConnection['provider'], string> = { twitch: 'Twitch', youtube: 'YouTube', tiktok_live: 'TikTok LIVE', kick: 'KICK' }

function PortalNav() {
  const items = [
    ['/dashboard', 'Overview'], ['/dashboard/connections', 'Platforms'],
    ['/dashboard/installations', 'Installations'], ['/dashboard/downloads', 'Downloads'],
    ['/dashboard/diagnostics', 'Diagnostics'], ['/dashboard/preferences', 'Preferences'],
    ['/dashboard/docs', 'Documentation'],
  ]
  const location = useLocation()
  return <nav className="portal-nav" aria-label="Account sections">{items.map(([to, label], index) => {
    const active = index === 0 ? location.pathname === to : location.pathname.startsWith(to)
    return <Link key={to} className={'portal-nav-link' + (active ? ' active' : '')} aria-current={active ? 'page' : undefined} to={to}>{label}</Link>
  })}</nav>
}

function PortalHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return <div className="portal-page-heading"><span className="eyebrow">{eyebrow}</span><h2>{title}</h2><p>{description}</p></div>
}

function Dashboard() {
  const { isLoaded, isSignedIn, getToken } = useAuth()
  const { user } = useUser()
  const location = useLocation()
  const [apiResult, setApiResult] = useState<ApiResult>({ status: 'loading', message: 'Checking the protected APIâ€¦' })
  const [connections, setConnections] = useState<PlatformConnection[]>([])
  const [installations, setInstallations] = useState<Installation[]>([])
  const [preferences, setPreferences] = useState<WebPreferences>({ locale: 'en', productUpdates: false })
  const [statusMessage, setStatusMessage] = useState('')
  const [health, setHealth] = useState<{status?: string; authConfigured?: boolean; databaseConfigured?: boolean} | null>(null)
  const [installName, setInstallName] = useState('')
  const [installPlatform, setInstallPlatform] = useState<'pcvr' | 'quest'>('pcvr')
  const [saving, setSaving] = useState(false)

  const apiFetch = useCallback(async (path: string, init: RequestInit = {}) => {
    const token = await getToken()
    if (!token) throw new Error('Your sign-in session is not ready. Refresh and try again.')
    const response = await fetch(apiBase + path, { ...init, headers: { Authorization: 'Bearer ' + token, ...(init.body ? { 'Content-Type': 'application/json' } : {}), ...init.headers } })
    const body = await response.json().catch(() => ({}))
    if (!response.ok) throw new Error(body.error ?? ('Request failed (' + response.status + ').'))
    return body
  }, [getToken])

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return
    let cancelled = false
    void apiFetch('/api/me').then(body => {
      if (!cancelled) setApiResult({ status: 'ok', message: 'The API verified your session.', userId: body.user?.userId })
    }).catch(error => {
      if (!cancelled) setApiResult({ status: 'error', message: error instanceof Error ? error.message : 'The API could not be reached.' })
    })
    return () => { cancelled = true }
  }, [apiFetch, isLoaded, isSignedIn])

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return
    let cancelled = false
    const path = location.pathname
    if (path === '/dashboard/preferences') void apiFetch('/api/settings').then(body => {
      if (cancelled) return
      const saved = (body.settings?.settings ?? {}) as WebPreferences
      setPreferences({ ...saved, locale: typeof saved.locale === 'string' ? saved.locale : 'en', productUpdates: saved.productUpdates === true })
      setStatusMessage('Saved preferences loaded from your account.')
    }).catch(error => { if (!cancelled) setStatusMessage(error.message ?? 'Could not load preferences.') })
    if (path === '/dashboard/connections') void apiFetch('/api/platform-connections').then(body => {
      if (!cancelled) { setConnections(body.connections ?? []); setStatusMessage('Connection records loaded for your account.') }
    }).catch(error => { if (!cancelled) setStatusMessage(error.message ?? 'Could not load connections.') })
    if (path === '/dashboard/installations') void apiFetch('/api/installations').then(body => {
      if (!cancelled) { setInstallations(body.installations ?? []); setStatusMessage('Installation records loaded for your account.') }
    }).catch(error => { if (!cancelled) setStatusMessage(error.message ?? 'Could not load installations.') })
    if (path === '/dashboard/diagnostics') void fetch(apiBase + '/api/_healthcheck').then(async response => {
      const body = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error('Health check returned HTTP ' + response.status)
      if (!cancelled) { setHealth(body); setStatusMessage('Development API health check responded successfully.') }
    }).catch(error => { if (!cancelled) setStatusMessage(error.message ?? 'Health check failed.') })
    return () => { cancelled = true }
  }, [apiFetch, isLoaded, isSignedIn, location.pathname])

  if (!isLoaded) return <main className="loading-state">Loading your accountâ€¦</main>
  if (!isSignedIn) return <Navigate to="/sign-in" replace />
  const displayName = user?.firstName || user?.username || 'there'
  const email = user?.primaryEmailAddress?.emailAddress ?? 'Email not available'
  const route = location.pathname.replace(/\/+$/, '') || '/dashboard'

  async function savePreferences() {
    setSaving(true); setStatusMessage('Saving preferencesâ€¦')
    try { await apiFetch('/api/settings', { method: 'PUT', body: JSON.stringify({ settings: preferences }) }); setStatusMessage('Preferences saved to your account.') }
    catch (error) { setStatusMessage(error instanceof Error ? error.message : 'Could not save preferences.') }
    finally { setSaving(false) }
  }
  async function createInstallation(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setStatusMessage('Creating pending installationâ€¦')
    try {
      const body = await apiFetch('/api/installations', { method: 'POST', body: JSON.stringify({ clientPlatform: installPlatform, displayName: installName.trim() }) })
      setInstallations(current => [body.installation, ...current]); setInstallName('')
      setStatusMessage('Pending installation record created. Pairing arrives in Step 10.')
    } catch (error) { setStatusMessage(error instanceof Error ? error.message : 'Could not create installation.') }
  }
  async function revokeInstallation(id: string) {
    if (!window.confirm('Revoke this installation record? This cannot be undone.')) return
    try {
      const body = await apiFetch('/api/installations/' + encodeURIComponent(id) + '/revoke', { method: 'POST' })
      setInstallations(current => current.map(item => item.id === id ? { ...item, ...body.installation } : item))
      setStatusMessage('Installation revoked.')
    } catch (error) { setStatusMessage(error instanceof Error ? error.message : 'Could not revoke installation.') }
  }

  return <main className="dashboard">
    <div className="dashboard-heading"><div><span className="eyebrow">YOUR ACCOUNT</span><h1>Welcome back, {displayName}.</h1><p>Manage account and web setup here. Gameplay module controls stay in-game.</p></div><UserButton /></div>
    <PortalNav />
    {route === '/dashboard' && <section className="dashboard-grid">
      <article className="panel"><div className="panel-heading"><span className="panel-icon"><UserRound aria-hidden="true" /></span><div><h2>Account profile</h2><p>Your signed-in identity</p></div></div><div className="profile-row"><span className="profile-avatar">{displayName.slice(0, 1).toUpperCase()}</span><div><strong>{user?.fullName || displayName}</strong><p>{email}</p></div></div><div className="detail-row"><span>Authentication</span><span className="state-pill"><i /> Signed in</span></div><div className="detail-row"><span>Account ID</span><code>{user?.id ?? 'Unavailable'}</code></div></article>
      <article className="panel"><div className="panel-heading"><span className="panel-icon"><CreditCard aria-hidden="true" /></span><div><h2>Current plan</h2><p>Your membership</p></div></div><div className="plan-name">Free <span>$0 / month</span></div><p className="panel-copy">Premium is planned at $7.99/month. Checkout is not connected and no paid subscription is active.</p><span className="coming-soon">BILLING NOT CONNECTED</span></article>
      <article className="panel"><div className="panel-heading"><span className="panel-icon"><ShieldCheck aria-hidden="true" /></span><div><h2>Protected API</h2><p>Server-side verification</p></div></div><div className={'api-state api-' + apiResult.status}><i />{apiResult.status === 'ok' ? 'Verified' : apiResult.status}</div><p className="panel-copy">{apiResult.message}</p>{apiResult.userId && <div className="detail-row"><span>Verified user ID</span><code>{apiResult.userId}</code></div>}<Link className="text-link" to="/dashboard/diagnostics">Open diagnostics <ArrowUpRight aria-hidden="true" /></Link></article>
      <article className="panel"><div className="panel-heading"><span className="panel-icon"><ListChecks aria-hidden="true" /></span><div><h2>Setup shortcuts</h2><p>Next steps</p></div></div><ul className="next-list"><li><span className="list-check"><ShieldCheck aria-hidden="true" /></span><div><strong>Secure account</strong><p>Managed authentication is active.</p></div></li><li><span className="list-pending">02</span><div><strong>Connect platforms</strong><p>OAuth connectors are upcoming.</p></div></li><li><span className="list-pending">03</span><div><strong>Pair game clients</strong><p>Pairing arrives in Step 10.</p></div></li></ul></article>
    </section>}
    {route === '/dashboard/connections' && <>
      <PortalHeading eyebrow="PLATFORM CONNECTIONS" title="Your streaming platforms" description="OAuth authorization becomes available after each connector is implemented and verified." />
      <div className="connection-grid">{(['twitch','youtube','tiktok_live','kick'] as const).map(provider => { const records = connections.filter(item => item.provider === provider); return <article className="panel connection-card" key={provider}><div className="connection-card-heading"><span className="panel-icon"><Globe2 aria-hidden="true" /></span><div><h3>{providerNames[provider]}</h3><p>{records.length ? records.map(item => item.status).join(', ') : 'Not connected'}</p></div></div><p className="panel-copy">{records.length ? 'Connection metadata is shown without credentials.' : 'No connection is registered for this account yet.'}</p><button className="button button-full button-disabled" disabled>{records.some(item => item.status === 'connected') ? 'Manage connection (coming soon)' : 'Connect when available'}</button></article> })}</div>
    </>}
    {route === '/dashboard/installations' && <>
      <PortalHeading eyebrow="INSTALLATION MANAGEMENT" title="Your game clients" description="Create and revoke account-owned installation records. Pairing codes and live synchronization are Step 10." />
      <form className="panel installation-form" onSubmit={createInstallation}><h3>Add an installation record</h3><div className="installation-fields"><label>Client platform<select value={installPlatform} onChange={event => setInstallPlatform(event.target.value as 'pcvr' | 'quest')}><option value="pcvr">PCVR</option><option value="quest">Quest standalone</option></select></label><label>Display name<input value={installName} onChange={event => setInstallName(event.target.value)} required minLength={1} maxLength={120} placeholder="e.g. Main PCVR setup" /></label><button className="button" type="submit">Add installation</button></div><p className="panel-copy">This creates a pending record only; it does not pair a client or issue credentials.</p></form>
      <div className="installation-list">{installations.length === 0 ? <article className="panel empty-state"><h3>No installations yet</h3><p>Add a PCVR or Quest record above. Pairing is not active yet.</p></article> : installations.map(item => <article className="panel installation-item" key={item.id}><div className="connection-card-heading"><span className="panel-icon">{item.client_platform === 'pcvr' ? <Monitor aria-hidden="true" /> : <Gamepad2 aria-hidden="true" />}</span><div><h3>{item.display_name}</h3><p>{item.client_platform === 'pcvr' ? 'PCVR' : 'Quest standalone'} · {item.status}</p></div></div><div className="detail-row"><span>Created</span><span>{item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Unavailable'}</span></div>{item.last_seen_at && <div className="detail-row"><span>Last seen</span><span>{new Date(item.last_seen_at).toLocaleString()}</span></div>}{item.status !== 'revoked' && <button className="button button-quiet" type="button" onClick={() => void revokeInstallation(item.id)}>Revoke record</button>}</article>)}</div>
    </>}
    {route === '/dashboard/preferences' && <>
      <PortalHeading eyebrow="WEB PREFERENCES" title="Make RiftPulse yours" description="These affect the website only. Gameplay module settings remain in the in-game Settings tab." />
      <section className="panel preferences-panel"><label className="preference-field">Website language<select value={preferences.locale ?? 'en'} onChange={event => setPreferences(current => ({ ...current, locale: event.target.value }))}><option value="en">English</option><option value="es">EspaÃ±ol</option><option value="fr">FranÃ§ais</option><option value="de">Deutsch</option></select><small>Saved preference only; full translations may be added later.</small></label><label className="preference-toggle"><span><strong>Product updates</strong><small>Save your interest in product announcements when that service is available.</small></span><input type="checkbox" checked={preferences.productUpdates === true} onChange={event => setPreferences(current => ({ ...current, productUpdates: event.target.checked }))} /></label><button className="button" disabled={saving} type="button" onClick={() => void savePreferences()}>{saving ? 'Savingâ€¦' : 'Save preferences'}</button></section>
    </>}
    {route === '/dashboard/downloads' && <><PortalHeading eyebrow="DOWNLOADS" title="Your RiftPulse builds" description="Download links will appear here when signed and tested artifacts are published." /><section className="panel empty-state"><h3>No public builds are published yet</h3><p>PCVR and Quest artifacts will list version, supported game/client version, checksum, and installation notes after acceptance testing.</p><span className="coming-soon">DOWNLOADS NOT AVAILABLE YET</span></section></>}
    {route === '/dashboard/diagnostics' && <><PortalHeading eyebrow="DIAGNOSTICS" title="System status" description="Non-secret health information for your account and development API." /><div className="dashboard-grid"><article className="panel"><h3>Protected account API</h3><div className={'api-state api-' + apiResult.status}><i />{apiResult.status}</div><p className="panel-copy">{apiResult.message}</p></article><article className="panel"><h3>Development service</h3><div className={'api-state ' + (health?.status === 'ok' ? 'api-ok' : 'api-error')}><i />{health?.status === 'ok' ? 'Online' : 'Unknown'}</div><p className="panel-copy">{statusMessage}</p>{health && <><div className="detail-row"><span>Auth configured</span><span>{health.authConfigured ? 'Yes' : 'No'}</span></div><div className="detail-row"><span>Database configured</span><span>{health.databaseConfigured ? 'Yes' : 'No'}</span></div></>}</article></div></>}
    {route === '/dashboard/docs' && <><PortalHeading eyebrow="DOCUMENTATION" title="Guides for your setup" description="Guides expand as the clients, connectors, and pairing are implemented." /><div className="docs-grid"><article className="panel"><h3>Account and privacy</h3><p className="panel-copy">Managed sign-in, account-scoped data, and the separation between website preferences and in-game settings.</p><a className="text-link" href="https://github.com/Chriser1234435/RiftPulse/blob/step-6-preview/docs/STEP4_DATABASE_REPORT.md" target="_blank" rel="noreferrer">Read data and security notes <ArrowUpRight aria-hidden="true" /></a></article><article className="panel"><h3>Installation guides</h3><p className="panel-copy">Published alongside verified PCVR and Quest builds.</p><span className="coming-soon">IN PREPARATION</span></article><article className="panel"><h3>Platform connections</h3><p className="panel-copy">OAuth instructions appear when each connector is ready.</p><span className="coming-soon">IN PREPARATION</span></article></div></>}
    {statusMessage && <p className="portal-status" role="status">{statusMessage}</p>}
  </main>
}

function NotFound() {
  return <main className="not-found"><span className="eyebrow">404 Â· NOT FOUND</span><h1>Wrong turn.</h1><p>The page youâ€™re looking for isnâ€™t here.</p><Link className="button" to="/">Back to RiftPulse</Link></main>
}

function App() {
  return (
    <div className="app-shell">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-in/*" element={<AuthPage mode="sign-in" />} />
        <Route path="/sign-up/*" element={<AuthPage mode="sign-up" />} />
        <Route path="/dashboard/*" element={<Dashboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <footer className="site-footer">
        <Brand />
        <span>Built for the moment your stream meets the game.</span>
        <span>Â© {currentYear} RiftPulse</span>
      </footer>
    </div>
  )
}

export default App
