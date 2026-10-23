import './App.css'

export default function SetupRequired() {
  return (
    <main className="setup-screen">
      <div className="brand-lockup">
        <span className="brand-mark">R</span>
        <span>RiftPulse</span>
      </div>
      <section className="setup-card">
        <span className="eyebrow">AUTHENTICATION SETUP</span>
        <h1>One last connection.</h1>
        <p>
          The RiftPulse sign-in experience is ready for configuration. Add your
          Clerk publishable key to the local environment to enable sign-in and
          account creation.
        </p>
        <div className="setup-code">VITE_CLERK_PUBLISHABLE_KEY=pk_test_...</div>
        <p className="muted">
          Keep secret keys on the server only. Never put a Clerk secret key in a
          variable prefixed with VITE_.
        </p>
        <a href="https://dashboard.clerk.com/" target="_blank" rel="noreferrer">
          Open Clerk Dashboard <span aria-hidden="true">↗</span>
        </a>
      </section>
      <footer>RiftPulse · Secure account access</footer>
    </main>
  )
}
