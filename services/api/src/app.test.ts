import { after, test } from 'node:test'
import assert from 'node:assert/strict'
import request from 'supertest'

const originalSecret = process.env.CLERK_SECRET_KEY
const originalPublishable = process.env.CLERK_PUBLISHABLE_KEY
const originalDatabaseUrl = process.env.DATABASE_URL
process.env.CLERK_SECRET_KEY = ''
process.env.CLERK_PUBLISHABLE_KEY = ''
delete process.env.DATABASE_URL

const { createApp } = await import('./app.js')
const app = createApp()

after(() => {
  if (originalSecret === undefined) delete process.env.CLERK_SECRET_KEY
  else process.env.CLERK_SECRET_KEY = originalSecret
  if (originalPublishable === undefined) delete process.env.CLERK_PUBLISHABLE_KEY
  else process.env.CLERK_PUBLISHABLE_KEY = originalPublishable
  if (originalDatabaseUrl === undefined) delete process.env.DATABASE_URL
  else process.env.DATABASE_URL = originalDatabaseUrl
})

test('health check is public and reports auth/database configuration state', async () => {
  const response = await request(app).get('/api/_healthcheck')
  assert.equal(response.status, 200)
  assert.deepEqual(response.body, {
    status: 'ok',
    service: 'riftpulse-api',
    authConfigured: false,
    databaseConfigured: false,
  })
})

test('protected identity endpoint fails closed when auth keys are absent', async () => {
  const response = await request(app).get('/api/me')
  assert.equal(response.status, 503)
  assert.equal(response.body.error, 'Authentication is not configured on this API.')
})

test('new account feature endpoints fail closed when auth is not configured', async () => {
  const checks = [
    request(app).get('/api/platform-connections'),
    request(app).get('/api/installations'),
    request(app).post('/api/installations').send({ clientPlatform: 'pcvr', displayName: 'Test setup' }),
    request(app).post('/api/installations/00000000-0000-4000-8000-000000000000/revoke'),
  ]
  for (const pending of checks) {
    const response = await pending
    assert.equal(response.status, 503)
    assert.equal(response.body.error, 'Authentication is not configured on this API.')
  }
})

test('unknown API routes do not expose server details', async () => {
  const response = await request(app).get('/api/private-internals')
  assert.equal(response.status, 404)
  assert.deepEqual(response.body, { error: 'Not found.' })
})

test('unapproved browser origins are rejected', async () => {
  const response = await request(app)
    .get('/api/_healthcheck')
    .set('Origin', 'https://unapproved.example')
  assert.equal(response.status, 403)
  assert.deepEqual(response.body, { error: 'Origin is not allowed.' })
})
