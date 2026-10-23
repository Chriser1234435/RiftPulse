import pg from 'pg'

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: true }, max: 1 })
const alpha = 'step4_smoke_alpha'
const beta = 'step4_smoke_beta'
try {
  const roleResult = await pool.query('SELECT current_user, rolbypassrls FROM pg_roles WHERE rolname = current_user')
  if (roleResult.rows[0]?.rolbypassrls) throw new Error('Runtime role unexpectedly bypasses RLS')
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    await client.query("SELECT set_config('riftpulse.user_id', $1, true)", [alpha])
    await client.query('INSERT INTO public.user_profiles (clerk_user_id) VALUES ($1) ON CONFLICT DO NOTHING', [alpha])
    await client.query('INSERT INTO public.user_settings (clerk_user_id, settings) VALUES ($1, $2::jsonb) ON CONFLICT (clerk_user_id) DO UPDATE SET settings = EXCLUDED.settings', [alpha, JSON.stringify({ smoke: true })])
    const ownSettings = await client.query('SELECT settings FROM public.user_settings WHERE clerk_user_id = $1', [alpha])
    if (ownSettings.rowCount !== 1 || ownSettings.rows[0].settings.smoke !== true) throw new Error('Own settings read/write failed')

    await client.query("SELECT set_config('riftpulse.user_id', $1, true)", [beta])
    await client.query('INSERT INTO public.user_profiles (clerk_user_id) VALUES ($1) ON CONFLICT DO NOTHING', [beta])
    const alphaVisibleToBeta = await client.query('SELECT clerk_user_id FROM public.user_profiles WHERE clerk_user_id = $1', [alpha])
    if (alphaVisibleToBeta.rowCount !== 0) throw new Error('Cross-user profile read was not blocked')
    await client.query('SAVEPOINT cross_owner_insert')
    let crossInsertRejected = false
    try {
      await client.query('INSERT INTO public.user_profiles (clerk_user_id) VALUES ($1)', [alpha])
    } catch (error) {
      crossInsertRejected = true
      await client.query('ROLLBACK TO SAVEPOINT cross_owner_insert')
    }
    if (!crossInsertRejected) throw new Error('Cross-owner insert was not rejected by RLS')

    await client.query("SELECT set_config('riftpulse.user_id', $1, true)", [alpha])
    const betaVisibleToAlpha = await client.query('SELECT clerk_user_id FROM public.user_profiles WHERE clerk_user_id = $1', [beta])
    if (betaVisibleToAlpha.rowCount !== 0) throw new Error('Cross-user profile read was not blocked for user A')
    await client.query('DELETE FROM public.user_settings WHERE clerk_user_id = $1', [alpha])
    await client.query('DELETE FROM public.user_profiles WHERE clerk_user_id = $1', [alpha])
    await client.query("SELECT set_config('riftpulse.user_id', $1, true)", [beta])
    await client.query('DELETE FROM public.user_profiles WHERE clerk_user_id = $1', [beta])
    await client.query('COMMIT')
    console.log(JSON.stringify({ connection: 'ok', role: roleResult.rows[0].current_user, rlsBypass: roleResult.rows[0].rolbypassrls, ownProfileSettingsReadWrite: 'passed', crossUserReads: 'blocked', crossOwnerInsert: 'blocked', testRowsCleaned: true }))
  } catch (error) {
    await client.query('ROLLBACK').catch(() => undefined)
    throw error
  } finally { client.release() }
} finally { await pool.end() }
